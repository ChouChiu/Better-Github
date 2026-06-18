import { createApp } from "vue";
import "./shared/styles/global.css";
import App from "./App.vue";
import { initReleaseSorter } from "./features/release-sorter";

initReleaseSorter();

const app = document.createElement("div");
document.body.append(app);
createApp(App).mount(app);
