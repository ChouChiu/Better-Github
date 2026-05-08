export const OS_OPTIONS = [
	"auto",
	"windows",
	"macos",
	"linux",
	"android",
	"ios",
] as const;

export type OsOption = (typeof OS_OPTIONS)[number];

export const OS_LABELS: Record<OsOption, string> = {
	auto: "Auto",
	windows: "Windows",
	macos: "macOS",
	linux: "Linux",
	android: "Android",
	ios: "iOS",
};

const SYSTEM_KEYWORDS: Record<Exclude<OsOption, "auto">, string[]> = {
	windows: ["win", "windows"],
	macos: ["mac", "macos"],
	linux: ["linux"],
	android: ["android"],
	ios: ["ios"],
};

export const ARCH_OPTIONS = [
	"auto",
	"x64",
	"x86",
	"arm64",
	"arm",
	"universal",
] as const;

export type ArchOption = (typeof ARCH_OPTIONS)[number];

export const ARCH_LABELS: Record<ArchOption, string> = {
	auto: "Auto",
	x64: "x64",
	x86: "x86",
	arm64: "arm64",
	arm: "arm",
	universal: "Universal",
};

const ARCH_KEYWORDS: Record<Exclude<ArchOption, "auto">, string[]> = {
	x64: ["x64", "x86_64", "amd64"],
	x86: ["x86", "i386", "i686"],
	arm64: ["arm64", "aarch64", "arm64-v8a"],
	arm: ["arm", "armeabi-v7a", "armv7"],
	universal: ["universal"],
};

export const PKG_OPTIONS = ["all", "installer", "portable"] as const;

export type PkgOption = (typeof PKG_OPTIONS)[number];

export const PKG_LABELS: Record<PkgOption, string> = {
	all: "All",
	installer: "Installer",
	portable: "Portable",
};

const PKG_KEYWORDS: Record<
	Exclude<PkgOption, "all">,
	Record<Exclude<OsOption, "auto">, string[]>
> = {
	installer: {
		windows: ["exe", "msi", "msix"],
		macos: ["dmg", "pkg"],
		linux: ["deb", "rpm"],
		android: ["apk"],
		ios: ["ipa"],
	},
	portable: {
		windows: ["zip", "portable"],
		macos: ["zip", "appimage"],
		linux: ["zip", "appimage"],
		android: [],
		ios: [],
	},
};

const OS_STORAGE_KEY = "better-gh:release-os";
const ARCH_STORAGE_KEY = "better-gh:release-arch";
const PKG_STORAGE_KEY = "better-gh:release-pkg";

const RELEASE_PAGE_RE = /^\/[^/]+\/[^/]+\/releases(\/|$)/;

const SOURCE_CODE_RE = /\.(tar\.gz|tar\.bz2|zip)$/i;
const SOURCE_CODE_PATH_RE = /\/archive\//;

export function detectPlatform(): Exclude<OsOption, "auto"> {
	const ua = navigator.userAgent.toLowerCase();
	const platform = navigator.platform.toLowerCase();

	if (/android/.test(ua)) return "android";
	if (/iphone|ipad|ipod/.test(ua)) return "ios";
	if (/win/.test(platform) || /win/.test(ua)) return "windows";
	if (/mac/.test(platform) || /mac/.test(ua)) return "macos";
	if (/linux/.test(platform) || /linux/.test(ua)) return "linux";

	return "windows";
}

export function getSelectedOs(): OsOption {
	const saved = GM_getValue(OS_STORAGE_KEY, "auto");
	if (OS_OPTIONS.includes(saved as OsOption)) return saved as OsOption;
	return "auto";
}

export function setSelectedOs(os: OsOption): void {
	GM_setValue(OS_STORAGE_KEY, os);
}

export function detectArch(): Exclude<ArchOption, "auto"> {
	const ua = navigator.userAgent.toLowerCase();
	if (/arm64|aarch64/.test(ua)) return "arm64";
	if (/arm/.test(ua)) return "arm";
	if (/x86/.test(ua) || /i386|i686/.test(ua)) return "x86";
	return "x64";
}

export function getSelectedArch(): ArchOption {
	const saved = GM_getValue(ARCH_STORAGE_KEY, "auto");
	if (ARCH_OPTIONS.includes(saved as ArchOption)) return saved as ArchOption;
	return "auto";
}

export function setSelectedArch(arch: ArchOption): void {
	GM_setValue(ARCH_STORAGE_KEY, arch);
}

export function getSelectedPkg(): PkgOption {
	const saved = GM_getValue(PKG_STORAGE_KEY, "all");
	if (PKG_OPTIONS.includes(saved as PkgOption)) return saved as PkgOption;
	return "all";
}

export function setSelectedPkg(pkg: PkgOption): void {
	GM_setValue(PKG_STORAGE_KEY, pkg);
}

function buildMatchKeywords(): Set<string> {
	const os = getSelectedOs();
	const arch = getSelectedArch();
	const pkg = getSelectedPkg();

	const resolvedOs = os === "auto" ? detectPlatform() : os;
	const keywords = new Set(SYSTEM_KEYWORDS[resolvedOs]);

	const resolvedArch = arch === "auto" ? detectArch() : arch;
	for (const kw of ARCH_KEYWORDS[resolvedArch]) {
		keywords.add(kw);
	}

	const pkgKws = PKG_KEYWORDS[pkg === "all" ? "installer" : pkg][resolvedOs];
	for (const kw of pkgKws) keywords.add(kw);
	if (pkg === "all") {
		for (const kw of PKG_KEYWORDS.portable[resolvedOs]) keywords.add(kw);
	}

	return keywords;
}

export function getKeywordsPreview(
	os: OsOption,
	arch: ArchOption,
	pkg: PkgOption,
): string[] {
	const resolvedOs = os === "auto" ? detectPlatform() : os;
	const resolvedArch = arch === "auto" ? detectArch() : arch;

	const result = [
		...SYSTEM_KEYWORDS[resolvedOs],
		...ARCH_KEYWORDS[resolvedArch],
	];

	result.push(...PKG_KEYWORDS.installer[resolvedOs]);
	if (pkg === "all") {
		result.push(...PKG_KEYWORDS.portable[resolvedOs]);
	} else {
		result.push(...PKG_KEYWORDS[pkg][resolvedOs]);
	}

	return result;
}

export function isReleasePage(): boolean {
	return RELEASE_PAGE_RE.test(window.location.pathname);
}

function extractFilename(anchor: HTMLAnchorElement): string | null {
	const href = anchor.getAttribute("href");
	if (!href) return null;

	if (SOURCE_CODE_PATH_RE.test(href)) return null;

	const lastSegment = href.split("/").pop();
	if (!lastSegment) return null;

	const decoded = decodeURIComponent(lastSegment);
	if (SOURCE_CODE_RE.test(decoded)) return null;

	return decoded.toLowerCase();
}

function countMatches(filename: string, keywords: Set<string>): number {
	let count = 0;
	for (const keyword of keywords) {
		if (new RegExp(`(^|[^a-z0-9])${keyword}([^a-z0-9]|$)`).test(filename)) {
			count++;
		}
	}
	return count;
}

export function sortAndHighlight(): void {
	const keywords = buildMatchKeywords();

	const links = document.querySelectorAll<HTMLAnchorElement>(
		'a[href*="/releases/download/"]',
	);
	const uls = new Set<HTMLUListElement>();

	for (const link of links) {
		const li = link.closest("li");
		if (li) {
			const ul = li.parentElement;
			if (ul instanceof HTMLUListElement) uls.add(ul);
		}
	}

	for (const ul of uls) {
		delete ul.dataset.betterGhSorted;

		const items = Array.from(ul.querySelectorAll(":scope > li"));
		if (items.length === 0) continue;

		const itemsWithScore = items.map((li, originalIndex) => {
			const anchor = li.querySelector<HTMLAnchorElement>(
				'a[href*="/releases/download/"]',
			);
			let score = 0;
			if (anchor) {
				const filename = extractFilename(anchor);
				if (filename) score = countMatches(filename, keywords);
			}
			return { element: li, score, originalIndex };
		});

		for (const item of itemsWithScore) {
			item.element.classList.remove("better-gh-matched");
		}

		itemsWithScore.sort(
			(a, b) => b.score - a.score || a.originalIndex - b.originalIndex,
		);

		const maxScore = itemsWithScore[0]?.score ?? 0;
		for (const item of itemsWithScore) {
			ul.appendChild(item.element);
			if (item.score === maxScore && maxScore > 0) {
				item.element.classList.add("better-gh-matched");
			}
		}

		ul.dataset.betterGhSorted = "true";
	}
}

export function initReleaseSorter(): void {
	if (isReleasePage()) {
		sortAndHighlight();
	}

	let turboTimeout: ReturnType<typeof setTimeout> | null = null;
	document.addEventListener("turbo:load", () => {
		if (!isReleasePage()) return;
		if (turboTimeout) clearTimeout(turboTimeout);
		turboTimeout = setTimeout(sortAndHighlight, 100);
	});

	let observerTimeout: ReturnType<typeof setTimeout> | null = null;
	new MutationObserver(() => {
		if (!isReleasePage()) return;
		if (observerTimeout) clearTimeout(observerTimeout);
		observerTimeout = setTimeout(sortAndHighlight, 100);
	}).observe(document.body, { childList: true, subtree: true });
}
