import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-context_COpWwYmK.mjs';

/**
* Convert a widget row to the API type
*/
function rowToWidget(row) {
	const widget = {
		id: row.id,
		type: row.type,
		title: row.title ?? void 0
	};
	if (row.type === "content" && row.content) try {
		widget.content = JSON.parse(row.content);
	} catch {}
	if (row.type === "menu" && row.menu_name) widget.menuName = row.menu_name;
	if (row.type === "component" && row.component_id) {
		widget.componentId = row.component_id;
		if (row.component_props) try {
			widget.componentProps = JSON.parse(row.component_props);
		} catch {}
	}
	return widget;
}

export { rowToWidget as r };
