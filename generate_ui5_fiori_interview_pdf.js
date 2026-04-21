const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const outputPath = path.join(process.cwd(), "UI5_Fiori_Interview_QA_4to5Years.pdf");

const qaList = [
  {
    q: "1) What is the difference between sap.ui.model.json.JSONModel, OData V2 Model, and OData V4 Model in real projects?",
    a: "JSONModel is client-side and best for transient UI state or mock data. OData V2 model supports mature enterprise features (batch, two-way binding, function imports) and is still common in ECC/S4 integrations. OData V4 model has cleaner API, stronger context-based binding, improved standards alignment, and is preferred for new development. For backend CRUD with enterprise semantics, use OData model; for local-only state, use JSONModel.",
  },
  {
    q: "2) Explain routing architecture in UI5 and common mistakes when navigation fails.",
    a: "Routing is configured in manifest.json under sap.ui5/routing with routes and targets. The router is initialized in Component init(). Common failures: wrong controlId/controlAggregation, missing view paths, typo in route pattern/name, async loading timing issues, and trying to navTo before component/router init. Deep-link behavior also depends on proper hash patterns and FLP intent configuration.",
  },
  {
    q: "3) How do you optimize performance in a large Fiori application?",
    a: "Use growing lists/tables, server-side paging/filtering, selective $select/$expand, lazy loading (fragments/views), avoid heavy formatter calls in large aggregations, debounce search, prefer expression binding where possible, and reduce invalidation by minimizing setProperty bursts. Enable preload bundles and use Component-preload.js in production. Profile with browser performance tools and UI5 diagnostics.",
  },
  {
    q: "4) When should you use formatter functions vs data types vs expression binding?",
    a: "Prefer built-in data types with formatOptions for standard formatting (dates, numbers, currency). Use expression binding for simple conditional UI logic. Use formatter only for reusable business transformation that cannot be expressed by data type/expression cleanly. Overusing formatters in table rows can become a performance bottleneck.",
  },
  {
    q: "5) What is the role of models at Component, View, and Control level?",
    a: "Model scope cascades downward. A model on Component is globally available in the app and ideal for shared data/i18n/device models. View-level model is local to that view and children. Control-level model is very specific and can override same-name model from upper levels. Named models avoid collisions and improve readability.",
  },
  {
    q: "6) How does two-way binding impact backend calls and validation?",
    a: "Two-way binding updates model on UI changes. With OData V2 it may trigger pending changes that are submitted via submitChanges (or automatically depending config). Validation should be done through type constraints, field group validation, and message manager. Blindly enabling two-way across many controls can create unintended updates and side effects.",
  },
  {
    q: "7) Explain $batch handling strategy for create/update/delete in enterprise apps.",
    a: "Group related changes into deferred batch groups, submit once, handle partial failures, and map backend messages via MessageManager. For transactional integrity, backend should validate and return meaningful messages. Frontend should keep pending state, disable duplicate submits, and provide rollback/reset behavior.",
  },
  {
    q: "8) How do you implement robust error handling in UI5/Fiori?",
    a: "Centralize OData request error handling (attachRequestFailed, model events, promise catches), parse SAP Gateway error payload, push messages to MessageManager, and surface user-friendly messages via MessagePopover/MessageBox. Log technical details separately. Differentiate validation errors, authorization failures, and system exceptions.",
  },
  {
    q: "9) What are best practices for Fragment usage?",
    a: "Use fragments for reusable UI blocks (dialogs/forms) and load asynchronously with Fragment.load. Add dependent to view for lifecycle and model propagation. Cache frequently used fragments to avoid re-creation. Keep fragment logic in controller and avoid deeply nested fragment dependencies.",
  },
  {
    q: "10) What is the difference between extension points, adaptation projects, and custom app copy?",
    a: "Extension points are provider-defined hooks in standard apps. Adaptation projects provide key-user style UI adaptation layered on standard apps with upgrade-safe extensibility. Custom app copy gives maximum control but higher maintenance and upgrade effort. Choose least invasive approach that satisfies requirement.",
  },
  {
    q: "11) How do you secure a Fiori app beyond role assignment?",
    a: "Never rely only on frontend checks. Enforce authorization in backend services, validate inputs server-side, protect against XSS by avoiding unsafe HTML injection, use CSP-compliant coding, and avoid exposing sensitive data in client models/logs. FLP roles/catalogs control discoverability, not complete data security.",
  },
  {
    q: "12) Explain lifecycle hooks and their ideal use cases (onInit, onBeforeRendering, onAfterRendering, onExit).",
    a: "onInit: setup models/router handlers once. onBeforeRendering: refresh lightweight UI state before paint. onAfterRendering: DOM-dependent logic (should be minimal). onExit: cleanup timers, detach handlers, destroy cached fragments. Memory leaks often come from missing cleanup in onExit.",
  },
  {
    q: "13) How do you handle memory leaks in long-running launchpad sessions?",
    a: "Detach event bus/router/model handlers, clear intervals/timeouts, destroy dynamically created controls/fragments, and avoid storing large object references globally. Re-enter app repeatedly in FLP sandbox to detect leaks. Use browser heap snapshots to confirm detached object cleanup.",
  },
  {
    q: "14) Describe testing strategy for a 4–5 year UI5 developer.",
    a: "Unit tests (QUnit + Sinon) for formatter/controller logic, OPA5 integration tests for user journeys/navigation, and optional wdi5/e2e for FLP-level scenarios. Mock OData for deterministic tests. In CI, run lint + unit + integration gates before transport/deployment.",
  },
  {
    q: "15) How do you decide between Smart Controls/Fiori Elements and Freestyle UI5?",
    a: "Use Fiori Elements when app fits standard floorplans and metadata-driven behavior to reduce code and improve consistency. Use Freestyle for custom interactions, complex client logic, or non-standard UX flows. Hybrid approach is possible: FE for most screens, freestyle for exceptional flows.",
  },
  {
    q: "16) What are key considerations for manifest.json quality?",
    a: "Correct app ID/namespace, routing consistency, dataSources/models alignment, crossNavigation inbounds for FLP intents, minimum UI5 version, and dependency declarations. Misconfigured manifest is a top cause of runtime navigation and deployment issues.",
  },
  {
    q: "17) Explain MessageManager integration with field validation.",
    a: "Register view with MessageManager, rely on types/constraints for automatic validation messages, and bind MessagePopover to message model. For backend validation messages, map technical targets to field paths where possible so messages anchor to exact controls.",
  },
  {
    q: "18) How do you improve table-heavy screen usability and performance simultaneously?",
    a: "Use responsive/p13n features where needed, avoid rendering too many columns by default, lazy-load additional details, enable growing/virtualization depending table type, and do server-side sort/filter. Keep row templates simple and avoid synchronous expensive formatter logic.",
  },
  {
    q: "19) What deployment paths are common for UI5/Fiori apps and what changes per path?",
    a: "ABAP on-prem/S4: deploy to BSP/UI5 repository, configure FLP catalog/target mapping/role. BTP HTML5 repo + Launchpad service: build/deploy MTAR or HTML5 artifacts, configure destinations, content provider/site roles. Core app code similar; deployment descriptors and launchpad content differ.",
  },
  {
    q: "20) Hard scenario: app works locally but fails in FLP with intent navigation. How do you troubleshoot?",
    a: "Validate inbound semantic object/action in manifest, FLP target mapping, role/catalog assignment, component ID, and URL/hash. Check browser console, network calls for Component-preload and manifest load errors, and compare local sandbox vs FLP runtime parameters. Also verify system alias/destination and cache invalidation after deployment.",
  },
];

const doc = new PDFDocument({
  size: "A4",
  margin: 50,
  info: {
    Title: "UI5/Fiori Interview Questions and Answers (4-5 Years)",
    Author: "Cline Assistant",
  },
});

doc.pipe(fs.createWriteStream(outputPath));

const pageBottom = () => doc.page.height - doc.page.margins.bottom;
const ensureSpace = (minSpace = 90) => {
  if (doc.y + minSpace > pageBottom()) {
    doc.addPage();
  }
};

doc.fontSize(18).text("UI5 / SAP Fiori Interview Questions & Answers", { align: "center" });
doc.moveDown(0.4);
doc.fontSize(11).fillColor("#333333").text("Experience Level: 4-5 Years | Difficulty: Moderate to Hard", { align: "center" });
doc.moveDown(1.2);

doc.fontSize(10).fillColor("black").text(
  "This document contains practical interview questions with concise model answers focused on architecture, performance, OData handling, testing, deployment, and troubleshooting in enterprise UI5/Fiori projects.",
  { align: "justify" }
);
doc.moveDown(1);

qaList.forEach((item) => {
  ensureSpace(120);
  doc.font("Helvetica-Bold").fontSize(11).text(item.q, { align: "left" });
  doc.moveDown(0.25);
  doc.font("Helvetica").fontSize(10).text(item.a, { align: "justify" });
  doc.moveDown(0.8);
});

ensureSpace(70);
doc.moveDown(0.6);
doc.font("Helvetica-Bold").fontSize(11).text("Preparation Tip", { underline: true });
doc.moveDown(0.2);
doc.font("Helvetica").fontSize(10).text(
  "For senior interviews, support each answer with one real project example: context, challenge, technical decision, and measurable outcome.",
  { align: "justify" }
);

doc.end();

console.log(`Generated: ${outputPath}`);