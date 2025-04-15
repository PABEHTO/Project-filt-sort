function getCurrentTableData() {
    const keys = ["Название", "Длина", "Ширина", "Максимальная глубина", "Расход воды", "Скорость течения", "Континент", "Страна истока"];
    
    return d3.select("#list")
        .selectAll("tr")
        .filter(function(elem, count) { return count > 0 })
        .nodes()
        .map(tr => Object.assign({},...d3.select(tr)
                .selectAll("td")
                .nodes()
                .map((td, i) => {
                    const key = keys[i];
                    const value = d3.select(td).text();
                    return { 
                        [key]: (key === "Название" || key === "Континент" || key === "Страна истока") ? value : Number(value) 
                    };
                })
        ));
}

createTable(riversData, 'list');
setSortSelects(riversData[0], document.getElementById('sort'));

const filterForm = document.getElementById('filter');
const filterInputs = filterForm.getElementsByTagName('input');
const sortForm = document.getElementById('sort');
const sortInputs = sortForm.getElementsByTagName('input');

let findButton, clearButton, sortButton, resetButton;

for (let i = 0; i < filterInputs.length; i++) {
    if (filterInputs[i].value === "Найти") {
        findButton = filterInputs[i];
    }
    if (filterInputs[i].value === "Очистить фильтры") {
        clearButton = filterInputs[i];
    }
}

for (let i = 0; i < sortInputs.length; i++) {
    if (sortInputs[i].value === "Сортировать") {
        sortButton = sortInputs[i];
    }
    if (sortInputs[i].value === "Сбросить сортировку") {
        resetButton = sortInputs[i];
    }
}

findButton.addEventListener('click', function() {
    filterTable(riversData, 'list', filterForm);
    let currentData = getCurrentTableData();
    resetSort('list', currentData, sortForm);
});

clearButton.addEventListener('click', function() {
    clearFilter('list', riversData, filterForm);
    resetSort('list', riversData, sortForm);
});

/*document.getElementById('fieldsFirst').addEventListener('change', function() {
    resetSubsequentSelects('fieldsFirst');
    changeNextSelect('fieldsSecond', this);
});

document.getElementById('fieldsSecond').addEventListener('change', function() {
    resetSubsequentSelects('fieldsSecond');
    changeNextSelect('fieldsThird', this);
});*/

d3.select("#river_count").on("change", function() {
    const isRiverCountChecked = this.checked;
    const avgLength = d3.select("#avg_length");
    const avgWidth = d3.select("#avg_width");
    
    if (isRiverCountChecked) {
        avgLength.property("checked", false).attr("disabled", true);
        avgWidth.property("checked", false).attr("disabled", true);
    } else {
        avgLength.attr("disabled", null);
        avgWidth.attr("disabled", null);
    }
});

d3.select("#avg_length").on("change", function() {
    const isChecked = this.checked;
    const riverCount = d3.select("#river_count");
    
    if (isChecked) {
        riverCount.property("checked", false).attr("disabled", true);
    } else if (!d3.select("#avg_width").property("checked")) {
        riverCount.attr("disabled", null);
    }
});

d3.select("#avg_width").on("change", function() {
    const isChecked = this.checked;
    const riverCount = d3.select("#river_count");
    
    if (isChecked) {
        riverCount.property("checked", false).attr("disabled", true);
    } else if (!d3.select("#avg_length").property("checked")) {
        riverCount.attr("disabled", null);
    }
});

sortButton.addEventListener('click', function() {
    sortTable('list', sortForm);
});

resetButton.addEventListener('click', function() {
    let currentData = getCurrentTableData();
    resetSort('list', currentData, sortForm);
});

const tableButton = document.getElementById("tableButton");

const graphButton = document.getElementById("drawButton");
const resetGraphButton = document.getElementById("resetGraphButton");

graphButton.addEventListener("click", function() {
    let currentData = getCurrentTableData();
    drawGraph(currentData);
});

resetGraphButton.addEventListener("click", function() {
    let svg = d3.select("svg");
    svg.selectAll('*').remove();
    document.getElementById("avg_length").checked = false;
    document.getElementById("avg_width").checked = false;
    document.getElementById("river_count").checked = false;
    document.getElementById("xSourceCountry").checked = true;

    d3.select("#avg_length").attr("disabled", null);
    d3.select("#avg_width").attr("disabled", null);
    d3.select("#river_count").attr("disabled", null);
    
});

tableButton.addEventListener("click", function() {
    let table = document.getElementById("list");
    if (table.style.display === "none") {
        table.style.display = "table";
        tableButton.value = "Скрыть таблицу";
    } else {
        table.style.display = "none";
        tableButton.value = "Показать таблицу";
    }
});