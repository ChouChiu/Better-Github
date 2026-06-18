import { computed, ref } from "vue";
import {
	type ArchOption,
	detectArch,
	detectPlatform,
	getKeywordsPreview,
	getSelectedArch,
	getSelectedOs,
	getSelectedPkg,
	type OsOption,
	type PkgOption,
	setSelectedArch,
	setSelectedOs,
	setSelectedPkg,
	sortAndHighlight,
} from "./core";

export {
	ARCH_LABELS,
	ARCH_OPTIONS,
	type ArchOption,
	detectArch,
	detectPlatform,
	getKeywordsPreview,
	getSelectedArch,
	getSelectedOs,
	getSelectedPkg,
	isReleasePage,
	OS_LABELS,
	OS_OPTIONS,
	type OsOption,
	PKG_LABELS,
	PKG_OPTIONS,
	type PkgOption,
	setSelectedArch,
	setSelectedOs,
	setSelectedPkg,
	sortAndHighlight,
} from "./core";

export function useReleaseSorter() {
	const selectedOs = ref<OsOption>(getSelectedOs());
	const selectedArch = ref<ArchOption>(getSelectedArch());
	const selectedPkg = ref<PkgOption>(getSelectedPkg());

	const resolvedPlatform = computed(() => {
		return selectedOs.value === "auto" ? detectPlatform() : selectedOs.value;
	});

	const resolvedArch = computed(() => {
		return selectedArch.value === "auto" ? detectArch() : selectedArch.value;
	});

	const keywords = computed(() => {
		return getKeywordsPreview(
			selectedOs.value,
			selectedArch.value,
			selectedPkg.value,
		);
	});

	function selectOs(os: OsOption) {
		selectedOs.value = os;
		setSelectedOs(os);
		sortAndHighlight();
	}

	function selectArch(arch: ArchOption) {
		selectedArch.value = arch;
		setSelectedArch(arch);
		sortAndHighlight();
	}

	function selectPkg(pkg: PkgOption) {
		selectedPkg.value = pkg;
		setSelectedPkg(pkg);
		sortAndHighlight();
	}

	return {
		selectedOs,
		selectedArch,
		selectedPkg,
		resolvedPlatform,
		resolvedArch,
		keywords,
		selectOs,
		selectArch,
		selectPkg,
	};
}
