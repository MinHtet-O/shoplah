import { EntityMetadata } from "typeorm";

export function excludeFields(
  metadata: EntityMetadata,
  excludedFields: string[]
): { [key: string]: boolean } {
  return metadata.columns.reduce((acc, column) => {
    acc[column.propertyName] = !excludedFields.includes(column.propertyName);
    return acc;
  }, {} as { [key: string]: boolean });
}
