"""CadQuery model of the Apollo R-PRO-1 ceiling-mount case.

Two printed parts:

``case_body``
    One piece, open towards the ceiling. The smooth front skin faces the room
    and is integral, so the mmWave radar still fires through 1.75 mm of plastic
    exactly like the stock part. The sensor compartment keeps the stock cavity
    (47.40 x 58.3756) and vent pitch, but is now 60 mm deep so the RJ45 jack and
    a straight USB-C plug both sit entirely inside. A divider wall separates a
    bay for a MeanWell IRM-10-5 mains module, which gets its own vents, a mains
    gland hole with cable-tie strain relief, and a pass-through to the sensor
    side for the 5 V leads.

``mount_plate``
    A flat plate that screws to the ceiling through four countersunk M3 holes.
    Four tabs hang off its underside, inside the body's long walls; the body is
    then hung on the plate with four M3 screws driven through the side walls.
    That keeps every fastener reachable at install time and leaves the visible
    front face unbroken.

Orientation: +Z points at the ceiling, z = 0 is the outside of the front skin.
The sensor cavity stays centred on x = y = 0 -- the same coordinates the stock
part uses -- and the PSU bay is added on the +X side.
"""

from __future__ import annotations

import cadquery as cq

from .params import DEFAULTS, CaseParams

Box = tuple[tuple[float, float, float], tuple[float, float, float]]

__all__ = ["case_body", "mount_plate", "assembly", "print_layout"]


# ---------------------------------------------------------------------------
# primitives
# ---------------------------------------------------------------------------


def _stadium(length: float, width: float, thickness: float) -> cq.Workplane:
    """Rounded-slot cross-section in XY, extruded along Z, centred on origin."""
    return (
        cq.Workplane("XY").slot2D(length, width, 0).extrude(thickness / 2.0, both=True)
    )


def _slot_through_y(length: float, height: float, thickness: float) -> cq.Workplane:
    """Rounded slot bored along Y: ``length`` spans X, ``height`` spans Z."""
    return _stadium(length, height, thickness).rotate((0, 0, 0), (1, 0, 0), 90)


def _slot_through_x(length: float, height: float, thickness: float) -> cq.Workplane:
    """Rounded slot bored along X: ``length`` spans Y, ``height`` spans Z."""
    return _slot_through_y(length, height, thickness).rotate((0, 0, 0), (0, 0, 1), 90)


def _bored_along(diameter: float, length: float, centre, axis) -> cq.Shape:
    """Cylinder of ``length`` centred on ``centre``, bored along ``axis``."""
    direction = cq.Vector(*axis)
    start = cq.Vector(*centre) - direction.multiply(length / 2.0)
    return cq.Solid.makeCylinder(diameter / 2.0, length, start, direction)


def _overlaps(shape: cq.Workplane | cq.Shape, boxes: list[Box]) -> bool:
    bb = (shape.val() if isinstance(shape, cq.Workplane) else shape).BoundingBox()
    for (x0, y0, z0), (x1, y1, z1) in boxes:
        if (
            bb.xmin < x1
            and bb.xmax > x0
            and bb.ymin < y1
            and bb.ymax > y0
            and bb.zmin < z1
            and bb.zmax > z0
        ):
            return True
    return False


# ---------------------------------------------------------------------------
# body features
# ---------------------------------------------------------------------------


def _cavity(p: CaseParams, x0: float, x1: float) -> cq.Workplane:
    """An open-topped compartment spanning ``x0``..``x1``."""
    return (
        cq.Workplane("XY", origin=((x0 + x1) / 2.0, 0.0, p.front_skin))
        .rect(x1 - x0, p.cavity_y)
        .extrude(p.body_z - p.front_skin + 1.0)
        .edges("|Z")
        .fillet(p.inner_corner_r)
    )


def _bay_vent_centres_x(p: CaseParams) -> tuple[float, float]:
    mid = (p.bay_x_min + p.bay_x_max) / 2.0
    offset = p.vent_y_wall_len / 2.0 + 3.4
    return (mid - offset, mid + offset)


def _keepouts(p: CaseParams) -> list[Box]:
    """Regions no vent slot may touch, so changing a parameter cannot merge a
    vent into the mains gland or into a mount screw."""
    boxes: list[Box] = []

    y_half = p.tie_slot_offset_y + p.tie_slot_w / 2.0 + 1.0
    z_half = max(p.mains_hole_d, p.tie_slot_h) / 2.0 + 2.0
    boxes.append(
        (
            (p.outer_x_max - p.wall - 1.0, -y_half, p.mains_hole_z - z_half),
            (p.outer_x_max + 1.0, y_half, p.mains_hole_z + z_half),
        )
    )

    for x in p.tab_centres_x:
        boxes.append(
            (
                (x - p.tab_w / 2.0 - 2.0, -p.outer_y - 1.0, p.body_z - p.tab_h - 2.0),
                (x + p.tab_w / 2.0 + 2.0, p.outer_y + 1.0, p.body_z + 1.0),
            )
        )
    return boxes


def _vent_cuts(p: CaseParams) -> list[cq.Workplane]:
    keepouts = _keepouts(p)
    bore = p.wall + 2.0
    x_walls = (p.outer_x_min + p.wall / 2.0, p.outer_x_max - p.wall / 2.0)
    y_walls = (-(p.outer_y - p.wall / 2.0), p.outer_y - p.wall / 2.0)
    long_wall_centres = tuple(p.vent_y_wall_centres_x) + _bay_vent_centres_x(p)

    cuts: list[cq.Workplane] = []
    for z in p.vent_row_centres():
        for x in x_walls:
            for y in p.vent_x_wall_centres_y:
                cuts.append(
                    _slot_through_x(p.vent_x_wall_len, p.vent_h, bore).translate(
                        (x, y, z)
                    )
                )
        for y in y_walls:
            for x in long_wall_centres:
                cuts.append(
                    _slot_through_y(p.vent_y_wall_len, p.vent_h, bore).translate(
                        (x, y, z)
                    )
                )
    return [c for c in cuts if not _overlaps(c, keepouts)]


def _service_cuts(p: CaseParams) -> list[cq.Workplane | cq.Shape]:
    bore = p.wall + 2.0
    bay_wall_x = p.outer_x_max - p.wall / 2.0
    cuts: list[cq.Workplane | cq.Shape] = [
        # mains lead into the PSU bay
        _bored_along(
            p.mains_hole_d, bore, (bay_wall_x, 0.0, p.mains_hole_z), (1, 0, 0)
        ),
        # 5 V leads from the PSU through to the sensor side
        _slot_through_x(p.wire_pass_w, p.wire_pass_h, p.divider + 2.0).translate(
            (
                (p.divider_x_min + p.divider_x_max) / 2.0,
                p.wire_pass_y,
                p.wire_pass_z,
            )
        ),
    ]

    # cable-tie strain relief, straddling the mains hole
    for sign in (-1.0, 1.0):
        cuts.append(
            _slot_through_x(p.tie_slot_w, p.tie_slot_h, bore).translate(
                (bay_wall_x, sign * p.tie_slot_offset_y, p.mains_hole_z)
            )
        )

    # screws that hang the body off the mount plate
    for x in p.tab_centres_x:
        for sign in (-1.0, 1.0):
            y = sign * (p.outer_y - p.wall / 2.0)
            cuts.append(
                _bored_along(p.side_screw_d, bore, (x, y, p.side_screw_z), (0, 1, 0))
            )
    return cuts


def _internal_features(p: CaseParams) -> list[cq.Workplane]:
    adds: list[cq.Workplane] = []

    # PSU bay: a pair of ribs that trap the module along Y. Along X the bay walls
    # already hold it, and with the front skin facing down gravity does the rest.
    gap = p.psu_y + p.psu_clearance_y
    for sign in (-1.0, 1.0):
        y_mid = sign * (gap / 2.0 + p.psu_rib_t / 2.0)
        adds.append(
            cq.Workplane(
                "XY",
                origin=((p.bay_x_min + p.bay_x_max) / 2.0, y_mid, p.front_skin),
            )
            .rect(p.bay_cavity_x, p.psu_rib_t)
            .extrude(p.psu_rib_h)
        )

    # Sensor compartment: the stock cavity leaves the 44.475 mm board 1.46 mm of
    # slop per side in X. These ribs cut that to `board_rib_clearance` without
    # obstructing the board, which still drops straight in from the open back.
    depth = p.board_rib_depth
    if depth > 0.05:
        for x_face, direction in ((p.sensor_x_min, 1.0), (p.sensor_x_max, -1.0)):
            for y in p.board_rib_centres_y:
                adds.append(
                    cq.Workplane(
                        "XY",
                        origin=(x_face + direction * depth / 2.0, y, p.front_skin),
                    )
                    .rect(depth, p.board_rib_w)
                    .extrude(p.board_rib_h)
                )
    return adds


def case_body(p: CaseParams = DEFAULTS) -> cq.Workplane:
    """The main shell: front skin, sensor compartment, PSU bay, vents, openings."""
    body = (
        cq.Workplane("XY", origin=(p.outer_x_mid, 0.0, 0.0))
        .rect(p.outer_width, 2.0 * p.outer_y)
        .extrude(p.body_z)
        .edges("|Z")
        .fillet(p.corner_r)
    )

    body = body.cut(_cavity(p, p.sensor_x_min, p.sensor_x_max))
    body = body.cut(_cavity(p, p.bay_x_min, p.bay_x_max))

    for cut in _vent_cuts(p):
        body = body.cut(cut)
    for cut in _service_cuts(p):
        body = body.cut(cut)
    for add in _internal_features(p):
        body = body.union(add)
    return body


# ---------------------------------------------------------------------------
# mount plate
# ---------------------------------------------------------------------------


def _countersunk_hole(p: CaseParams, x: float, y: float) -> cq.Shape:
    sink = (p.mount_head_d - p.mount_hole_d) / 2.0  # 90 degree included angle
    cone = cq.Solid.makeCone(
        p.mount_head_d / 2.0,
        p.mount_hole_d / 2.0,
        sink,
        cq.Vector(x, y, p.body_z),
        cq.Vector(0, 0, 1),
    )
    shaft = cq.Solid.makeCylinder(
        p.mount_hole_d / 2.0,
        p.plate_t + 2.0,
        cq.Vector(x, y, p.body_z - 1.0),
        cq.Vector(0, 0, 1),
    )
    return cone.fuse(shaft)


def mount_plate(p: CaseParams = DEFAULTS) -> cq.Workplane:
    """Ceiling plate. Modelled in assembled position, capping the body's rim."""
    plate = (
        cq.Workplane("XY", origin=(p.outer_x_mid, 0.0, p.body_z))
        .rect(p.outer_width, 2.0 * p.outer_y)
        .extrude(p.plate_t)
        .edges("|Z")
        .fillet(p.corner_r)
    )

    for x in p.tab_centres_x:
        for sign in (-1.0, 1.0):
            plate = plate.union(
                cq.Workplane("XY", origin=(x, sign * p.tab_mid_y, p.body_z - p.tab_h))
                .rect(p.tab_w, p.tab_t)
                .extrude(p.tab_h)
            )

    for x in p.tab_centres_x:
        for sign in (-1.0, 1.0):
            plate = plate.cut(
                _bored_along(
                    p.tab_pilot_d,
                    p.tab_t + 6.0,
                    (x, sign * p.tab_mid_y, p.side_screw_z),
                    (0, 1, 0),
                )
            )

    for x in (p.outer_x_min + p.mount_inset_x, p.outer_x_max - p.mount_inset_x):
        for y in (-p.mount_hole_y, p.mount_hole_y):
            plate = plate.cut(_countersunk_hole(p, x, y))

    return plate


# ---------------------------------------------------------------------------
# arrangements
# ---------------------------------------------------------------------------


def assembly(p: CaseParams = DEFAULTS) -> cq.Assembly:
    """Both parts in their assembled position, for inspection in CAD."""
    return (
        cq.Assembly(name="apollo-r-pro-1-ceiling-case")
        .add(case_body(p), name="case_body", color=cq.Color("gray"))
        .add(mount_plate(p), name="mount_plate", color=cq.Color("steelblue"))
    )


def print_layout(
    p: CaseParams = DEFAULTS, gap: float = 10.0
) -> tuple[cq.Workplane, cq.Workplane]:
    """Both parts laid flat on the bed in their printing orientation.

    The body prints front-skin-down with the opening up: no supports anywhere,
    and the vent slots are 2 mm bridges in vertical walls. The plate is flipped
    so its tabs and countersinks face up and its flat ceiling face is on the bed.
    """
    body = case_body(p)
    plate = mount_plate(p).rotate((0, 0, 0), (1, 0, 0), 180)
    plate = plate.translate((0.0, 0.0, -plate.val().BoundingBox().zmin))
    plate = plate.translate((0.0, 2.0 * p.outer_y + gap, 0.0))
    return body, plate
