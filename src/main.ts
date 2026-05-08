import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { initReleaseSorter } from "./utils/release-sorter";

initReleaseSorter();

createApp(App).mount(
	(() => {
		const app = document.createElement("div");
		document.body.append(app);
		return app;
	})(),
);
