import type { GqlWidgetDataSelection, WidgetLayout } from '../../utils/widget/widget';
import { fromB64, toB64 } from '../../utils/String';
import { normalizeFilterGroupForBackend, normalizeFilterGroupForFrontend } from '../../utils/filters/filtersUtils';
import type { DashboardManifest, DashboardWidget } from './dashboard-types';

/**
 * Serialize a complex dashboard manifest, sanitizing all filters inside the manifest before.
 * @param manifest
 */
export const serializeDashboardManifestForBackend = (
  manifest: DashboardManifest,
): string => {
  const newWidgets: Record<string, unknown> = {};
  const widgetIds = manifest.widgets ? Object.keys(manifest.widgets) : [];
  widgetIds.forEach((id) => {
    const widget = manifest.widgets[id];
    if (!widget || !Array.isArray(widget.dataSelection)) {
      return;
    }
    newWidgets[id] = {
      ...widget,
      dataSelection: widget.dataSelection.map(
        (selection) => ({
          ...selection,
          filters: normalizeFilterGroupForBackend(selection.filters),
          dynamicFrom: normalizeFilterGroupForBackend(selection.dynamicFrom),
          dynamicTo: normalizeFilterGroupForBackend(selection.dynamicTo),
        }),
      ),
    };
  });

  return toB64(JSON.stringify({
    ...manifest,
    widgets: newWidgets,
  }));
};

export const deserializeDashboardManifestForFrontend = (
  manifestB64Str: string | undefined | null,
): DashboardManifest => {
  const emptyManifest: DashboardManifest = {
    widgets: {},
    config: {},
  };
  if (!manifestB64Str) {
    return emptyManifest;
  }
  let manifestStr: string;
  try {
    manifestStr = fromB64(manifestB64Str);
  } catch {
    return emptyManifest;
  }
  if (!manifestStr) {
    return emptyManifest;
  }
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(manifestStr);
  } catch {
    return emptyManifest;
  }
  const widgets: Record<string, DashboardWidget> = {};
  const widgetIds = manifest.widgets && typeof manifest.widgets === 'object'
    ? Object.keys(manifest.widgets as Record<string, unknown>)
    : [];
  widgetIds.forEach((id) => {
    const widget = (manifest.widgets as Record<string, Record<string, unknown>>)[id];
    if (!widget || !Array.isArray(widget.dataSelection)) {
      return;
    }
    widgets[id] = {
      ...widget,
      dataSelection: widget.dataSelection.map(
        // Assert backend
        (selection: GqlWidgetDataSelection) => ({
          ...selection,
          filters: selection.filters
            ? normalizeFilterGroupForFrontend(selection.filters)
            : undefined,
          dynamicFrom: selection.dynamicFrom
            ? normalizeFilterGroupForFrontend(selection.dynamicFrom)
            : undefined,
          dynamicTo: selection.dynamicTo
            ? normalizeFilterGroupForFrontend(selection.dynamicTo)
            : undefined,
        }),
      ),
    } as DashboardWidget;
  });

  return {
    config: {},
    ...(manifest as Partial<DashboardManifest>),
    widgets,
  };
};

/**
 * Merge a manifest with local layout changes.
 *
 * @remarks
 * We need to sync manifest with local layouts before sending for update.
 * A desync occurs when resizing or moving a widget because in those cases
 * we skip a complete reload to avoid performance issue.
 *
 * @param newManifest Manifest to merge with local changes.
 * @param layouts Local layout changes.
 */
export const prepareManifest = (newManifest: DashboardManifest, layouts: Record<string, WidgetLayout>) => {
  const syncWidgets = Object.values(newManifest.widgets).reduce((res, widget) => {
    const localLayout = layouts[widget.id];
    res[widget.id] = {
      ...widget,
      layout: localLayout || widget.layout,
    };
    return res;
  }, {} as DashboardManifest['widgets']);
  return {
    ...newManifest,
    widgets: syncWidgets,
  };
};
