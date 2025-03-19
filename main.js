let getCurrentTableData = () => {
    let table = document.getElementById('list');
    let allRows = table.rows;
    let rowsArray = Array.from(allRows).slice(1);

    let tableData = [];
    for (let row of rowsArray) {
        let cells = row.cells;
        let cellsArray = Array.from(cells);
        let rowData = {};
        for (let j = 0; j < cellsArray.length; j++) {
            let cellText = cellsArray[j].innerHTML;
            let columnName = Object.keys(riversData[0])[j];
            rowData[columnName] = cellText;
        }
        tableData.push(rowData);
    }
    return tableData;
};

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

document.getElementById('fieldsFirst').addEventListener('change', function() {
    resetSubsequentSelects('fieldsFirst');
    changeNextSelect('fieldsSecond', this); 
});

document.getElementById('fieldsSecond').addEventListener('change', function() {
    resetSubsequentSelects('fieldsSecond');
    changeNextSelect('fieldsThird', this); 
});

sortButton.addEventListener('click', function() {
    sortTable('list', sortForm);
});

resetButton.addEventListener('click', function() {
    let currentData = getCurrentTableData();
    resetSort('list', currentData, sortForm);
});