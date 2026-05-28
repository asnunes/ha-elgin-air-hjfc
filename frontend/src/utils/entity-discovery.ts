import { HomeAssistant } from "../types.js";

/**
 * Find a switch entity with `_scrdisp` suffix on the same device as
 * the given climate entity. Returns undefined if not found.
 */
export function findDisplaySwitchEntity(
  hass: HomeAssistant,
  climateEntityId: string
): string | undefined {
  const entities = hass.entities;
  if (!entities) return undefined;
  const climateEntry = entities[climateEntityId];
  if (!climateEntry?.device_id) return undefined;
  for (const [eid, entry] of Object.entries(entities)) {
    if (
      entry.device_id === climateEntry.device_id &&
      eid.startsWith("switch.") &&
      eid.endsWith("_scrdisp")
    ) {
      return eid;
    }
  }
  return undefined;
}
