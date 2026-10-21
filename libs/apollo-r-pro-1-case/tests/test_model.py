"""Checks on the solids, not on the code that makes them.

The expensive thing here is the OCCT boolean cascade, so both parts are built
once per session and every assertion reads off the finished solids.
"""

from __future__ import annotations

import math

import cadquery as cq
import pytest
from apollo_r_pro_1_case import DEFAULTS as P
from apollo_r_pro_1_case import case_body, mount_plate, print_layout
from apollo_r_pro_1_case.params import (
    BOARD_FRONT_STACK,
    BOARD_RJ45_BEHIND,
    BOARD_T,
    BOARD_USBC_MOUTH_BEHIND,
    BOARD_X,
    BOARD_Y,
    STOCK_CAVITY_X,
    STOCK_CAVITY_Y,
    STOCK_CORNER_R,
    STOCK_FRONT_SKIN,
    STOCK_VENT_H,
)

#: Rear face of the board once its front-side component stack bottoms out on the
#: front skin. Nothing fastens the board, exactly as on the stock part.
BOARD_REAR_Z = P.front_skin + BOARD_FRONT_STACK + BOARD_T


@pytest.fixture(scope="session")
def body() -> cq.Shape:
    return case_body().val()


@pytest.fixture(scope="session")
def plate() -> cq.Shape:
    return mount_plate().val()


def _free(body: cq.Shape, cx, cy, z0, sx, sy, sz) -> float:
    """Volume of ``body`` inside the given box. Zero means the box is clear."""
    box = cq.Solid.makeBox(sx, sy, sz, cq.Vector(cx - sx / 2.0, cy - sy / 2.0, z0))
    overlap = body.intersect(box)
    return 0.0 if overlap is None else overlap.Volume()


# -- the parts are printable solids ----------------------------------------


def test_body_is_one_valid_solid(body):
    assert body.isValid()
    assert len(body.Solids()) == 1


def test_plate_is_one_valid_solid(plate):
    assert plate.isValid()
    assert len(plate.Solids()) == 1


def test_parts_do_not_interfere(body, plate):
    overlap = body.intersect(plate)
    assert overlap is None or overlap.Volume() == pytest.approx(0.0, abs=1e-6)


def test_plate_tabs_have_a_fit_clearance(body, plate):
    """Not just non-interfering: there has to be a real gap, or the tabs are a
    zero-clearance fit that no printer will produce."""
    assert P.tab_clearance > 0.0
    grown = plate.translate(cq.Vector(0.0, P.tab_clearance * 0.9, 0.0))
    overlap = body.intersect(grown)
    assert overlap is None or overlap.Volume() == pytest.approx(0.0, abs=1e-6)


def test_both_parts_fit_an_h2c_bed():
    laid_out = cq.Compound.makeCompound([s.val() for s in print_layout()])
    bb = laid_out.BoundingBox()
    assert bb.xlen < 250.0
    assert bb.ylen < 250.0
    assert bb.zlen < 250.0
    assert bb.zmin == pytest.approx(0.0, abs=1e-6)


# -- the brief ---------------------------------------------------------------


def test_at_least_60mm_clear_inside_for_an_upright_usb_c_plug():
    assert P.inner_height >= 60.0
    assert P.body_z - BOARD_REAR_Z >= 40.0


def test_rj45_is_fully_enclosed():
    """The whole jack has to clear the rim, with the back now solid."""
    assert BOARD_REAR_Z + BOARD_RJ45_BEHIND < P.body_z


def test_usb_c_mouth_has_room_for_a_straight_plug():
    mouth = BOARD_REAR_Z + BOARD_USBC_MOUTH_BEHIND
    assert P.body_z - mouth >= 30.0


def test_back_is_solid_apart_from_the_ceiling_screws(plate):
    """The stock lid has an RJ45 aperture; this one has four M3 holes and
    nothing else, because the jack now lives inside the case."""
    ceiling = [
        f
        for f in plate.Faces()
        if f.geomType() == "PLANE"
        and f.Center().z == pytest.approx(P.body_z + P.plate_t, abs=1e-6)
    ]
    assert len(ceiling) == 1
    footprint = P.outer_width * 2.0 * P.outer_y
    screws = 4.0 * math.pi * (P.mount_hole_d / 2.0) ** 2
    assert ceiling[0].Area() == pytest.approx(footprint - screws, rel=0.01)


def test_front_skin_is_one_smooth_face(body):
    """No dimples: the room-facing face is a single plane, not 5649 dents."""
    outer = [
        f
        for f in body.Faces()
        if f.geomType() == "PLANE" and f.Center().z == pytest.approx(0.0, abs=1e-6)
    ]
    assert len(outer) == 1
    footprint = P.outer_width * 2.0 * P.outer_y
    assert outer[0].Area() == pytest.approx(footprint, rel=0.01)


def test_ceiling_mount_holes_are_four_and_near_the_corners():
    xs = (P.outer_x_min + P.mount_inset_x, P.outer_x_max - P.mount_inset_x)
    ys = (-P.mount_hole_y, P.mount_hole_y)
    assert len(xs) * len(ys) == 4
    for x in xs:
        assert P.outer_x_min < x < P.outer_x_max
    for y in ys:
        assert -P.outer_y < y < P.outer_y


# -- the board still fits the way it did ------------------------------------


def test_sensor_cavity_and_front_skin_match_the_stock_part():
    """The radar fires through the front skin and the board stack sits on it."""
    assert P.front_skin == STOCK_FRONT_SKIN
    assert P.sensor_cavity_x == STOCK_CAVITY_X
    assert P.cavity_y == STOCK_CAVITY_Y
    assert P.corner_r == STOCK_CORNER_R


def test_board_envelope_is_clear(body):
    assert _free(body, 0.0, 0.0, P.front_skin, BOARD_X, BOARD_Y, 20.0) == pytest.approx(
        0.0, abs=1e-6
    )


def test_connector_attic_is_clear_over_the_whole_board(body):
    height = P.body_z - BOARD_REAR_Z
    assert _free(body, 0.0, 0.0, BOARD_REAR_Z, BOARD_X, BOARD_Y, height) == (
        pytest.approx(0.0, abs=1e-6)
    )


def test_locating_ribs_take_up_the_board_slop(body):
    """Ribs cut 1.46 mm of per-side slop down to `board_rib_clearance` without
    blocking the board, which still drops in from the open back."""
    assert P.board_rib_depth > 0.0
    gap = P.sensor_cavity_x - 2.0 * P.board_rib_depth
    assert gap == pytest.approx(BOARD_X + 2.0 * P.board_rib_clearance)
    # material is present at the rib, and absent just past the board edge
    rib_y = P.board_rib_centres_y[0]
    at_rib = _free(
        body,
        P.sensor_x_min + P.board_rib_depth / 2.0,
        rib_y,
        P.front_skin + 1.0,
        P.board_rib_depth * 0.5,
        1.0,
        1.0,
    )
    assert at_rib > 0.0


# -- the MeanWell bay --------------------------------------------------------


def test_psu_envelope_is_clear(body):
    mid = (P.bay_x_min + P.bay_x_max) / 2.0
    assert _free(body, mid, 0.0, P.front_skin, P.psu_x, P.psu_y, P.psu_z) == (
        pytest.approx(0.0, abs=1e-6)
    )


def test_psu_ribs_trap_the_module_along_y(body):
    mid = (P.bay_x_min + P.bay_x_max) / 2.0
    just_past = (P.psu_y + P.psu_clearance_y) / 2.0 + P.psu_rib_t / 2.0
    assert _free(body, mid, just_past, P.front_skin + 1.0, 2.0, 1.0, 1.0) > 0.0


def test_mains_lead_can_enter_the_bay(body):
    """Hole bored clean through the bay's outer wall."""
    bore = cq.Solid.makeCylinder(
        P.mains_hole_d / 2.0,
        P.wall + 4.0,
        cq.Vector(P.outer_x_max - P.wall - 2.0, 0.0, P.mains_hole_z),
        cq.Vector(1, 0, 0),
    )
    overlap = body.intersect(bore)
    assert overlap is None or overlap.Volume() == pytest.approx(0.0, abs=1e-6)


def test_cable_tie_slots_straddle_the_mains_hole():
    inner = P.tie_slot_offset_y - P.tie_slot_w / 2.0
    assert inner > P.mains_hole_d / 2.0 + 1.5


def test_low_voltage_leads_can_cross_the_divider(body):
    """The slot is a stadium, so only its straight middle is full height. That
    middle section alone has to be clear right through the divider."""
    straight = P.wire_pass_w - P.wire_pass_h
    probe = _free(
        body,
        (P.divider_x_min + P.divider_x_max) / 2.0,
        P.wire_pass_y,
        P.wire_pass_z - P.wire_pass_h / 2.0 + 0.5,
        P.divider + 2.0,
        straight,
        P.wire_pass_h - 1.0,
    )
    assert probe == pytest.approx(0.0, abs=1e-6)


def test_divider_slot_passes_an_assembled_usb_c_plug(body):
    """A 12 x 7 overmoulded plug, so the lead can be made up before fitting."""
    probe = _free(
        body,
        (P.divider_x_min + P.divider_x_max) / 2.0,
        P.wire_pass_y,
        P.wire_pass_z - 3.5,
        P.divider + 2.0,
        12.0,
        7.0,
    )
    assert probe == pytest.approx(0.0, abs=1e-6)


# -- vents -------------------------------------------------------------------


def test_vents_keep_the_stock_pitch_and_phase():
    rows = P.vent_row_centres()
    assert rows[0] == pytest.approx(4.0)  # stock first row
    assert rows[1] - rows[0] == pytest.approx(16.0 / 3.0)
    assert len(rows) >= 9
    assert rows[-1] + STOCK_VENT_H / 2.0 < P.body_z - P.tab_h


def test_no_vent_runs_into_a_fastener_or_the_gland(body):
    """The keep-out filter has to actually drop the colliding slots."""
    for x in P.tab_centres_x:
        for sign in (-1.0, 1.0):
            y = sign * (P.outer_y - P.wall / 2.0)
            around = _free(body, x, y, P.body_z - P.tab_h, P.tab_w, P.wall, P.tab_h)
            # solid wall apart from the single M3 clearance hole
            assert around > P.tab_w * P.wall * P.tab_h * 0.7
