# TOON Format

TOON is the custom import format parsed by `src/lib/utils/toon-parser.ts` for aerial move seed/import data.

## Header

The first line declares the row count and fields:

```text
data[109]{Id,Figura,Base,Descripcion,Image,Video,Contributor}:
```

The parser requires this pattern:

```text
data[count]{comma,separated,fields}:
```

## Rows

Each following non-empty, non-comment line is a CSV-like row. Lines starting with `//` are ignored.

Expected field order:

| Field         | Parsed Property | Notes                   |
| ------------- | --------------- | ----------------------- |
| `Id`          | `id`            | Move id                 |
| `Figura`      | `figura`        | Move name               |
| `Base`        | `base`          | Category/base technique |
| `Descripcion` | `descripcion`   | `null` becomes `null`   |
| `Image`       | `image`         | `null` becomes `null`   |
| `Video`       | `video`         | `null` becomes `null`   |
| `Contributor` | `contributor`   | `null` becomes `null`   |

Quoted strings may contain commas. Double quotes are used only as quote delimiters by the current parser.

## Example

```text
data[2]{Id,Figura,Base,Descripcion,Image,Video,Contributor}:
move-1,Footlock,Silks,"Basic foot lock",null,null,Unknown
move-2,Hip Key,Silks,"Entry with comma, inside text",https://example/image.jpg,null,Coach
```

If the parsed row count does not match the declared count, the parser logs a warning and returns the parsed rows.
