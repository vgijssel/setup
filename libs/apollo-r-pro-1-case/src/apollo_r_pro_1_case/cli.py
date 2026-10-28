"""Write the printable files for the Apollo R-PRO-1 ceiling-mount case."""

from __future__ import annotations

import argparse
from pathlib import Path

import cadquery as cq
from cadquery import exporters

from .model import assembly, print_layout
from .params import DEFAULTS, CaseParams

STEM = "apollo-r-pro-1-ceiling-case"

#: mesh tolerances. 0.02 mm deflection keeps the R2 corners and the rounded vent
#: ends smooth without inflating the file the way the stock dimpled STL does.
LINEAR_TOLERANCE = 0.02
ANGULAR_TOLERANCE = 0.1


def write(out_dir: Path, p: CaseParams = DEFAULTS) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    body, plate = print_layout(p)

    written: list[Path] = []

    for name, part in (("body", body), ("mount-plate", plate)):
        path = out_dir / f"{STEM}-{name}.stl"
        exporters.export(
            part,
            str(path),
            tolerance=LINEAR_TOLERANCE,
            angularTolerance=ANGULAR_TOLERANCE,
        )
        written.append(path)

    # Both parts, already arranged on the bed: this is the file to open in
    # Bambu Studio. Use "split to objects" there if you want to print one part.
    plate_path = out_dir / f"{STEM}.3mf"
    exporters.export(
        cq.Compound.makeCompound([body.val(), plate.val()]),
        str(plate_path),
        exportType=exporters.ExportTypes.THREEMF,
        tolerance=LINEAR_TOLERANCE,
        angularTolerance=ANGULAR_TOLERANCE,
    )
    written.append(plate_path)

    # Assembled, as solids, for anyone who wants to measure or edit it in CAD.
    step_path = out_dir / f"{STEM}.step"
    assembly(p).export(str(step_path))
    written.append(step_path)

    return written


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out",
        type=Path,
        default=Path("dist"),
        help="output directory (default: dist)",
    )
    args = parser.parse_args(argv)

    p = DEFAULTS
    print(
        f"body {p.outer_width:.2f} x {2 * p.outer_y:.2f} x {p.body_z:.2f} mm, "
        f"{p.inner_height:.1f} mm clear inside, "
        f"{len(p.vent_row_centres())} vent rows"
    )
    for path in write(args.out, p):
        print(f"  wrote {path} ({path.stat().st_size / 1024:.0f} KiB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
