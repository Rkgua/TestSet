var courses = [
  { id: 1, name: "数学" }, { id: 2, name: "语文" }, { id: 3, name: "英语" },
  { id: 4, name: "物理" }, { id: 5, name: "化学" }, { id: 6, name: "生物" },
];
var nextId = 7;

var schedule = {
  mon:{morning:[],afternoon:[],evening:[]}, tue:{morning:[],afternoon:[],evening:[]},
  wed:{morning:[],afternoon:[],evening:[]}, thu:{morning:[],afternoon:[],evening:[]},
  fri:{morning:[],afternoon:[],evening:[]}, sat:{morning:[],afternoon:[],evening:[]},
  sun:{morning:[],afternoon:[],evening:[]},
};

var days = [
  {key:"mon",label:"周一"},{key:"tue",label:"周二"},{key:"wed",label:"周三"},
  {key:"thu",label:"周四"},{key:"fri",label:"周五"},{key:"sat",label:"周六"},{key:"sun",label:"周日"},
];
var slots = [
  {key:"morning",label:"上午"},{key:"afternoon",label:"下午"},{key:"evening",label:"晚上"},
];

var courseListEl = document.getElementById("courseList");
var scheduleGridEl = document.getElementById("scheduleGrid");
var rightPanelEl = document.getElementById("rightPanel");
var dragGhostEl = document.getElementById("dragGhost");
var removeZoneEl = document.getElementById("removeZone");
var leftPanelEl = document.getElementById("leftPanel");
var inputEl = document.getElementById("newCourseInput");
var addBtn = document.getElementById("addBtn");
var toggleBtn = document.getElementById("toggleBtn");

var ds = { isDragging:false, course:null, source:null, sourceDay:null, sourceSlot:null, sourceIndex:null, startX:0, startY:0, x:0, y:0, hasMoved:false };
var dropDay = null, dropSlot = null, hoverRemove = false;
var lastTouch = 0, scrollTimer = null;
var cleanupMove = null, cleanupEnd = null;

function render() {
  var html = "";
  for (var i = 0; i < courses.length; i++) {
    var c = courses[i];
    html += '<div class="course-item" data-course-id="' + c.id + '">' + c.name + '</div>';
  }
  courseListEl.innerHTML = html;

  html = '<div class="grid-header grid-corner">时段</div>';
  for (var i = 0; i < days.length; i++) html += '<div class="grid-header">' + days[i].label + '</div>';
  for (var s = 0; s < slots.length; s++) {
    html += '<div class="time-label">' + slots[s].label + '</div>';
    for (var d = 0; d < days.length; d++) {
      var day = days[d].key, slot = slots[s].key;
      var arr = schedule[day] && schedule[day][slot] || [];
      html += '<div class="cell-wrapper" data-day="' + day + '" data-slot="' + slot + '">';
      if (arr.length > 0) {
        for (var ci = 0; ci < arr.length; ci++) {
          var co = arr[ci];
          html += '<div class="placed-course" data-day="' + day + '" data-slot="' + slot + '" data-index="' + ci + '" data-course-id="' + co.id + '">' + co.name + '</div>';
        }
      } else {
        html += '<div class="cell-slot"><span class="empty-hint">+</span></div>';
      }
      html += '</div>';
    }
  }
  scheduleGridEl.innerHTML = html;
}

function addCourse() {
  var name = inputEl.value.trim();
  if (!name) return;
  courses.push({ id: nextId++, name: name });
  inputEl.value = "";
  render();
}

function getPt(e) {
  if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches.length > 0) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function getDrop(x, y) {
  if (y > window.innerHeight - 60) return { type:"remove" };
  var el = document.elementFromPoint(x, y);
  if (!el) return null;
  while (el && el !== document.body) {
    var d = el.getAttribute("data-day"), s = el.getAttribute("data-slot"), z = el.getAttribute("data-zone");
    if (d && s) return { type:"schedule", day:d, slot:s };
    if (z === "course-list") return { type:"list" };
    el = el.parentElement;
  }
  return null;
}

function scrollStart(dir) {
  if (scrollTimer) return;
  scrollTimer = setInterval(function() {
    rightPanelEl.scrollLeft += dir * 8;
    var el = document.elementFromPoint(ds.x, ds.y);
    updateTarget(el);
  }, 16);
}
function scrollStop() { if (scrollTimer) { clearInterval(scrollTimer); scrollTimer = null; } }

function dropTo(day, slot) {
  var arr = schedule[day][slot];
  if (!arr || arr.length >= 2) return;
  if (ds.source === "list") {
    for (var i = 0; i < courses.length; i++) {
      if (courses[i].id === ds.course.id) { arr.push(courses.splice(i, 1)[0]); break; }
    }
  } else if (ds.source === "schedule") {
    if (ds.sourceDay === day && ds.sourceSlot === slot) return;
    var src = schedule[ds.sourceDay] && schedule[ds.sourceDay][ds.sourceSlot];
    if (!src || ds.sourceIndex === null || ds.sourceIndex >= src.length) return;
    arr.push(src.splice(ds.sourceIndex, 1)[0]);
  }
}

function removeFrom(day, slot, idx) {
  var arr = schedule[day] && schedule[day][slot];
  if (arr && idx < arr.length) arr.splice(idx, 1);
}

function reset() {
  ds.isDragging = false; ds.course = null; ds.source = null;
  ds.sourceDay = null; ds.sourceSlot = null; ds.sourceIndex = null;
  ds.hasMoved = false; ds.x = 0; ds.y = 0;
  dropDay = null; dropSlot = null; hoverRemove = false;
  dragGhostEl.classList.remove("show"); removeZoneEl.classList.remove("show");
  render();
}

function clearHighlights() {
  var els = document.querySelectorAll(".cell-wrapper.drop-active, .placed-course.drag-source, .placed-course.remove-zone, .course-item.drag-source");
  for (var i = 0; i < els.length; i++) {
    els[i].classList.remove("drop-active", "drag-source", "remove-zone");
  }
}

function updateSource(el) {
  if (!el) return;
  while (el && el !== document.body) {
    if (el.classList.contains("course-item") || el.classList.contains("placed-course")) {
      el.classList.add("drag-source");
      return;
    }
    el = el.parentElement;
  }
}

function updateTarget(el) {
  clearHighlights();
  dropDay = null; dropSlot = null; hoverRemove = false;

  if (ds.isDragging && ds.source === "list") {
    var items = courseListEl.querySelectorAll(".course-item");
    for (var i = 0; i < items.length; i++) {
      if (parseInt(items[i].getAttribute("data-course-id"),10) === ds.course.id) {
        items[i].classList.add("drag-source"); break;
      }
    }
  } else if (ds.isDragging && ds.source === "schedule") {
    var items = scheduleGridEl.querySelectorAll(".placed-course");
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute("data-day") === ds.sourceDay &&
          items[i].getAttribute("data-slot") === ds.sourceSlot &&
          parseInt(items[i].getAttribute("data-index"),10) === ds.sourceIndex) {
        items[i].classList.add("drag-source"); break;
      }
    }
  }

  if (!el) return;
  if (ds.y > window.innerHeight - 60) {
    hoverRemove = true;
    var all = document.querySelectorAll(".placed-course");
    for (var i = 0; i < all.length; i++) all[i].classList.add("remove-zone");
    return;
  }
  while (el && el !== document.body) {
    var d = el.getAttribute("data-day"), s = el.getAttribute("data-slot");
    if (d && s) {
      el.classList.add("drop-active");
      dropDay = d; dropSlot = s;
      break;
    }
    el = el.parentElement;
  }
}

function onMove(e) {
  var pt = getPt(e);
  ds.x = pt.x; ds.y = pt.y;
  dragGhostEl.style.left = pt.x + "px"; dragGhostEl.style.top = pt.y + "px";
  if (!ds.hasMoved) {
    var dx = pt.x - ds.startX, dy = pt.y - ds.startY;
    if (Math.sqrt(dx*dx + dy*dy) < 8) return;
    ds.hasMoved = true; ds.isDragging = true;
    dragGhostEl.classList.add("show"); removeZoneEl.classList.add("show");
  }
  if (e.cancelable) e.preventDefault();
  scrollStop();
  var r = rightPanelEl.getBoundingClientRect();
  if (pt.x < r.left + 30) scrollStart(-1);
  else if (pt.x > r.right - 30) scrollStart(1);
  updateTarget(document.elementFromPoint(pt.x, pt.y));
}

function onUp(e) {
  if (cleanupMove) cleanupMove();
  if (cleanupEnd) cleanupEnd();
  scrollStop();
  if (!ds.hasMoved) { reset(); return; }
  var pt = getPt(e);
  var t = getDrop(pt.x, pt.y);
  if (t) {
    if (t.type === "schedule") dropTo(t.day, t.slot);
    else if (ds.source === "schedule") {
      removeFrom(ds.sourceDay, ds.sourceSlot, ds.sourceIndex);
      courses.push({ id: ds.course.id, name: ds.course.name });
    }
  }
  reset();
}

function onCancel() {
  if (cleanupMove) cleanupMove();
  if (cleanupEnd) cleanupEnd();
  scrollStop();
  reset();
}

function startDrag(e, course, source, day, slot, index) {
  var pt = getPt(e);
  ds.course = { id: course.id, name: course.name };
  ds.source = source; ds.sourceDay = day; ds.sourceSlot = slot; ds.sourceIndex = index;
  ds.startX = pt.x; ds.startY = pt.y; ds.x = pt.x; ds.y = pt.y; ds.hasMoved = false;
  dragGhostEl.textContent = course.name;
  dragGhostEl.style.left = pt.x + "px"; dragGhostEl.style.top = pt.y + "px";

  if (e.touches) {
    var fn = function(ev) { onMove(ev); if (ds.hasMoved) ev.preventDefault(); };
    document.addEventListener("touchmove", fn, { passive: false });
    document.addEventListener("touchend", onUp);
    document.addEventListener("touchcancel", onCancel);
    cleanupMove = function() { document.removeEventListener("touchmove", fn); document.removeEventListener("touchcancel", onCancel); };
    cleanupEnd = function() { document.removeEventListener("touchend", onUp); };
  } else {
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    cleanupMove = function() { document.removeEventListener("mousemove", onMove); };
    cleanupEnd = function() { document.removeEventListener("mouseup", onUp); };
  }
}

function getData(el) {
  while (el && el !== document.body) {
    if (el.classList.contains("course-item")) {
      var id = parseInt(el.getAttribute("data-course-id"), 10);
      for (var i = 0; i < courses.length; i++) if (courses[i].id === id) return { course: courses[i], source: "list", day: null, slot: null, index: null };
      return null;
    }
    if (el.classList.contains("placed-course")) {
      var d = el.getAttribute("data-day"), s = el.getAttribute("data-slot"), idx = parseInt(el.getAttribute("data-index"), 10);
      var arr = schedule[d] && schedule[d][s];
      if (arr && idx < arr.length) return { course: arr[idx], source: "schedule", day: d, slot: s, index: idx };
      return null;
    }
    el = el.parentElement;
  }
  return null;
}

courseListEl.addEventListener("mousedown", function(e) {
  if (Date.now() - lastTouch < 500) return;
  var data = getData(e.target);
  if (data) { e.preventDefault(); startDrag(e, data.course, data.source, data.day, data.slot, data.index); }
});

scheduleGridEl.addEventListener("mousedown", function(e) {
  if (Date.now() - lastTouch < 500) return;
  var data = getData(e.target);
  if (data) { e.preventDefault(); startDrag(e, data.course, data.source, data.day, data.slot, data.index); }
});

courseListEl.addEventListener("touchstart", function(e) {
  lastTouch = Date.now();
  var data = getData(e.target);
  if (data) startDrag(e, data.course, data.source, data.day, data.slot, data.index);
}, { passive: true });

scheduleGridEl.addEventListener("touchstart", function(e) {
  lastTouch = Date.now();
  var data = getData(e.target);
  if (data) startDrag(e, data.course, data.source, data.day, data.slot, data.index);
}, { passive: true });

addBtn.addEventListener("click", addCourse);
inputEl.addEventListener("keyup", function(e) { if (e.key === "Enter") addCourse(); });

function togglePanel() {
  var c = leftPanelEl.classList.toggle("collapsed");
  toggleBtn.classList.toggle("collapsed");
  toggleBtn.textContent = c ? "▶" : "◀";
}
toggleBtn.addEventListener("click", togglePanel);

render();
