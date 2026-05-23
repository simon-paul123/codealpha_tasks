from pathlib import Path
import argparse
import shutil


def unique_destination(destination_folder, file_name):
    destination = destination_folder / file_name
    if not destination.exists():
        return destination

    stem = destination.stem
    suffix = destination.suffix
    counter = 1

    while True:
        renamed_destination = destination_folder / f"{stem}_{counter}{suffix}"
        if not renamed_destination.exists():
            return renamed_destination
        counter += 1


def move_jpg_files(source_folder, destination_folder):
    source = Path(source_folder)
    destination = Path(destination_folder)

    if not source.exists() or not source.is_dir():
        raise FileNotFoundError(f"Source folder not found: {source}")

    destination.mkdir(parents=True, exist_ok=True)

    moved_count = 0
    failed_count = 0
    for jpg_file in source.iterdir():
        if jpg_file.is_file() and jpg_file.suffix.lower() == ".jpg":
            target = unique_destination(destination, jpg_file.name)
            try:
                shutil.move(str(jpg_file), str(target))
            except PermissionError as error:
                if target.exists():
                    try:
                        target.unlink(missing_ok=True)
                    except PermissionError:
                        print(f"Copied file may still exist at: {target}")
                print(f"Could not move {jpg_file.name}: {error}")
                failed_count += 1
            else:
                print(f"Moved: {jpg_file.name} -> {target}")
                moved_count += 1

    if moved_count == 0 and failed_count == 0:
        print("No .jpg files found.")
    else:
        print(f"Done. Moved {moved_count} .jpg file(s).")
        if failed_count:
            print(f"Failed to move {failed_count} file(s).")


def main():
    parser = argparse.ArgumentParser(
        description="Move all .jpg files from one folder to another folder."
    )
    parser.add_argument("source", help="Folder that currently contains the .jpg files")
    parser.add_argument("destination", help="Folder where the .jpg files should be moved")
    args = parser.parse_args()

    move_jpg_files(args.source, args.destination)


if __name__ == "__main__":
    main()
