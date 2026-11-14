"""Dimensions for the Apollo R-PRO-1 ceiling-mount case.

Everything is millimetres.

The ``STOCK_*`` constants were measured off the original part that ships with the
R-PRO-1 (``reference/r_pro-1_case.stl``, 3 674 660 triangles). They are kept here
so the remodel can reproduce the geometry the sensor board actually depends on --
the cavity size, the front-skin thickness the mmWave radar looks through, and the
vent pitch -- rather than re-inventing it.

The ``BOARD_*`` constants come from Apollo's own ``R PRO-1 PCB.obj`` mesh and are
cross-checked against the aperture positions in their ``R_PRO-1_Lid.step``.
"""

from __future__ import annotations

from dataclasses import dataclass

# ---------------------------------------------------------------------------
# Stock case, as measured
# ---------------------------------------------------------------------------

STOCK_OUTER_X = 50.90
STOCK_OUTER_Y = 61.8756
STOCK_OUTER_Z = 24.0
STOCK_WALL = 1.75
STOCK_CORNER_R = 2.0
#: inner wall faces sit at x = +/-23.70 and y = +/-29.1878.
STOCK_CAVITY_X = 47.40
STOCK_CAVITY_Y = 58.3756
#: inner face of the front skin. Also the datum the board stack bottoms out on.
STOCK_FRONT_SKIN = 1.75
#: vent slots: 2.0 mm tall, rounded ends, four rows 16/3 mm apart.
STOCK_VENT_H = 2.0
STOCK_VENT_PITCH_Z = 16.0 / 3.0
STOCK_VENT_ROW0_BOTTOM_Z = 3.0
#: +/-X walls carry four 7.0 mm slots per row, +/-Y walls three 7.2 mm slots.
STOCK_VENT_X_WALL_LEN = 7.0
STOCK_VENT_X_WALL_CENTRES_Y = (-21.5, -7.17, 7.17, 21.5)
STOCK_VENT_Y_WALL_LEN = 7.2
STOCK_VENT_Y_WALL_CENTRES_X = (-16.0, 0.0, 16.0)
#: 5649 spherical dents of R0.5, recessed 0.5 mm into every exterior face. These
#: are decorative and are the sole reason the stock STL is 183 MB; dropped here.
STOCK_DIMPLE_R = 0.5

# ---------------------------------------------------------------------------
# `R-PRO-1` board
# ---------------------------------------------------------------------------

BOARD_X = 44.475
BOARD_Y = 56.975
BOARD_T = 1.586
#: height of the tallest front-side component stack measured from the board's front face. The board is
#: not fastened: this stack rests on the front skin and sets the board's height.
BOARD_FRONT_STACK = 13.9
#: both connectors leave the *rear* face of the board, pointing out of the back.
BOARD_RJ45_BEHIND = 16.90
BOARD_USBC_MOUTH_BEHIND = 10.00


@dataclass(frozen=True)
class CaseParams:
    """Every dimension of the remodel. Override any field to re-cut the part."""

    # -- shell ------------------------------------------------------------
    #: side walls and divider. 2.0 mm (5 x 0.4 mm extrusions) rather than the
    #: stock 1.75 mm, because the box is now 2.6x taller and 1.6x wider.
    wall: float = 2.0
    #: left at the stock value on purpose: the mmWave radar fires through it and
    #: it is the datum the board stack sits on. Changing it moves the board.
    front_skin: float = STOCK_FRONT_SKIN
    corner_r: float = STOCK_CORNER_R
    inner_corner_r: float = 2.0
    #: front inner face to the underside of the mount plate. The requirement is
    #: >= 60 so a straight USB-C plug stands up inside the case; the RJ45 tops
    #: out around z = 34 and is fully enclosed well below that.
    inner_height: float = 60.0

    # -- sensor compartment ----------------------------------------------
    sensor_cavity_x: float = STOCK_CAVITY_X
    cavity_y: float = STOCK_CAVITY_Y
    #: ribs on the +/-X cavity walls that take up the board's sideways slop.
    board_rib_clearance: float = 0.5
    board_rib_w: float = 3.0
    board_rib_h: float = 18.0
    board_rib_centres_y: tuple[float, ...] = (-14.0, 14.0)

    # -- PSU bay (MeanWell IRM-10-5, 45.7 x 25.4 x 21.4, PCB-pin type) ----
    divider: float = 2.0
    psu_x: float = 25.4
    psu_y: float = 45.7
    psu_z: float = 21.4
    psu_clearance_x: float = 1.6
    psu_clearance_y: float = 0.8
    #: ribs that trap the module along Y. It is laid body-down on the front skin
    #: with its pins facing the open back, so the pins stay reachable.
    psu_rib_t: float = 1.6
    psu_rib_h: float = 8.0

    # -- vents ------------------------------------------------------------
    vent_h: float = STOCK_VENT_H
    vent_pitch: float = STOCK_VENT_PITCH_Z
    vent_x_wall_len: float = STOCK_VENT_X_WALL_LEN
    vent_x_wall_centres_y: tuple[float, ...] = STOCK_VENT_X_WALL_CENTRES_Y
    vent_y_wall_len: float = STOCK_VENT_Y_WALL_LEN
    vent_y_wall_centres_x: tuple[float, ...] = STOCK_VENT_Y_WALL_CENTRES_X
    #: dead band below the rim, kept clear for the mount-plate tabs.
    vent_top_margin: float = 10.0

    # -- mount plate ------------------------------------------------------
    plate_t: float = 3.0
    #: tabs hang off the plate, inside the +/-Y walls, and take the body screws.
    tab_t: float = 3.5
    tab_w: float = 14.0
    tab_h: float = 8.0
    tab_centres_x: tuple[float, ...] = (-14.0, 39.2)
    #: per-side gap between a tab and the wall it slides against. Without this
    #: the tabs are nominally a zero-clearance fit and do not go in.
    tab_clearance: float = 0.25
    #: pilot for an M3 self-tapping screw in the tab, M3 clearance through the wall.
    tab_pilot_d: float = 2.5
    side_screw_d: float = 3.2
    #: ceiling screws—M3 clearance, 90 degree countersink, heads flush inside.
    mount_hole_d: float = 3.4
    mount_head_d: float = 6.4
    mount_inset_x: float = 7.0
    mount_hole_y: float = 20.0

    # -- mains entry, in the outer wall of the PSU bay --------------------
    mains_hole_d: float = 7.0
    #: measured down from the rim, so the lead leaves next to the ceiling.
    mains_hole_below_rim: float = 8.0
    #: pair of through-slots for a cable tie, as strain relief.
    tie_slot_w: float = 3.5
    tie_slot_h: float = 1.8
    tie_slot_offset_y: float = 8.0

    # -- low-voltage pass-through, through the divider --------------------
    #: rounded slot, so the clear rectangle inside it is narrower than `w` x `h`.
    #: sized to pass an assembled USB-C plug (about 12 x 7), not just bare wire.
    wire_pass_w: float = 18.0
    wire_pass_h: float = 10.0
    wire_pass_y: float = -12.0
    wire_pass_z: float = 32.0

    # -- derived ----------------------------------------------------------

    @property
    def body_z(self) -> float:
        """Rim height of the body. The plate caps it from z = body_z upwards."""
        return self.front_skin + self.inner_height

    @property
    def sensor_x_min(self) -> float:
        return -self.sensor_cavity_x / 2.0

    @property
    def sensor_x_max(self) -> float:
        return self.sensor_cavity_x / 2.0

    @property
    def divider_x_min(self) -> float:
        return self.sensor_x_max

    @property
    def divider_x_max(self) -> float:
        return self.sensor_x_max + self.divider

    @property
    def bay_cavity_x(self) -> float:
        return self.psu_x + self.psu_clearance_x

    @property
    def bay_x_min(self) -> float:
        return self.divider_x_max

    @property
    def bay_x_max(self) -> float:
        return self.bay_x_min + self.bay_cavity_x

    @property
    def outer_x_min(self) -> float:
        return self.sensor_x_min - self.wall

    @property
    def outer_x_max(self) -> float:
        return self.bay_x_max + self.wall

    @property
    def outer_y(self) -> float:
        """Half the outer depth."""
        return self.cavity_y / 2.0 + self.wall

    @property
    def outer_x_mid(self) -> float:
        return (self.outer_x_min + self.outer_x_max) / 2.0

    @property
    def outer_width(self) -> float:
        return self.outer_x_max - self.outer_x_min

    @property
    def board_rib_depth(self) -> float:
        """How far each locating rib stands off the cavity wall."""
        return (self.sensor_cavity_x - BOARD_X) / 2.0 - self.board_rib_clearance

    @property
    def tab_outer_y(self) -> float:
        """Outer face of a mount-plate tab, a shade inside the cavity wall."""
        return self.cavity_y / 2.0 - self.tab_clearance

    @property
    def tab_mid_y(self) -> float:
        """Mid-plane of a mount-plate tab: where its screw pilot is centred."""
        return self.tab_outer_y - self.tab_t / 2.0

    @property
    def mains_hole_z(self) -> float:
        return self.body_z - self.mains_hole_below_rim

    @property
    def side_screw_z(self) -> float:
        return self.body_z - self.tab_h / 2.0

    def vent_row_centres(self) -> list[float]:
        """Z centres of the vent rows, on the stock pitch and in stock phase."""
        first = (
            self.front_skin
            + (STOCK_VENT_ROW0_BOTTOM_Z - STOCK_FRONT_SKIN)
            + self.vent_h / 2.0
        )
        limit = self.body_z - self.vent_top_margin
        rows: list[float] = []
        row = 0
        while True:
            z = first + row * self.vent_pitch
            if z + self.vent_h / 2.0 > limit:
                return rows
            rows.append(z)
            row += 1


DEFAULTS = CaseParams()
