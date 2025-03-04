/**
 * This service runs all Widget management operations, handles widget
 * persistance and defines possible Widget properties.
 */
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { IWidget } from './widgets-interface';

@Injectable()
export class WidgetManagerService {

  widgets: Array<IWidget>;

  constructor(
    private AppSettingsService: AppSettingsService
  ) {
    this.widgets = this.AppSettingsService.getWidgets();
  }

  private newUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
  }

  getWidget(uuid: string) {
      return this.widgets.find(w => w.uuid == uuid);
  }

  newWidget() {
    const uuid = this.newUuid();
    this.widgets.push({ uuid: uuid, type: 'WidgetBlank', config: null });
    this.saveWidgets();
    return uuid;
  }

  deleteWidget(uuid) {
    const wIndex = this.widgets.findIndex(w => w.uuid == uuid);
    if (wIndex < 0) { return; } // not found
    this.widgets.splice(wIndex, 1);
  }

  updateWidgetType(uuid: string, newNodeType: string) {
    const wIndex = this.widgets.findIndex(w => w.uuid == uuid);
    if (wIndex < 0) { return; } // not found
    this.widgets[wIndex].config = null;
    this.widgets[wIndex].type = newNodeType;
    this.saveWidgets();
  }

  updateWidgetConfig(uuid: string, newConfig) {
    const wIndex = this.widgets.findIndex(w => w.uuid == uuid);
    if (wIndex < 0) { return; } // not found
    this.widgets[wIndex].config = newConfig;
    this.saveWidgets();
  }

  saveWidgets() {
    this.AppSettingsService.saveWidgets(this.widgets);
  }

}
