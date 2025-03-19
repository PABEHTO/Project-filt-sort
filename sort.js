let createSortArr = (data) => {
    let sortArr = [];
    let sortSelects = data.getElementsByTagName('select');
    for (let i = 0; i < sortSelects.length; i++) {
        let keySort = sortSelects[i].value;
        if (keySort == 0) {
            break;
        }
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push({
            column: keySort - 1,
            order: desc
        });
    }
    return sortArr;
};

let sortTable = (idTable, data) => {
    let sortArr = createSortArr(data);
    if (sortArr.length === 0) {
        return false;
    }
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
    rowData.shift(); // удаляем заголовок

    rowData.sort((first, second) => {
        for (let i in sortArr) {
            let key = sortArr[i].column;
            let value1 = first.cells[key].innerHTML;
            let value2 = second.cells[key].innerHTML;

            // числовые поля:
            if (key === 1 || key === 2 || key === 3 || key === 4 || key === 5) {
                value1 = Number(value1);
                value2 = Number(value2);
                if (sortArr[i].order) { // по убыванию
                    if (value1 > value2) return -1;
                    if (value1 < value2) return 1;
                } else { // по возрастанию
                    if (value1 > value2) return 1;
                    if (value1 < value2) return -1;
                }
            } else { // текстовые поля
                if (sortArr[i].order) { // по убыванию
                    if (value1 > value2) return -1;
                    if (value1 < value2) return 1;
                } else { // по возрастанию
                    if (value1 > value2) return 1;
                    if (value1 < value2) return -1;
                }
            }
            if (value1 === value2) continue;
        }
        return 0;
    });

    rowData.forEach(item => {
        table.append(item);
    });
};

let resetSort = (idTable, data, sortForm) => {
    setSortSelects(riversData[0], sortForm);
    clearTable(idTable);
    createTable(data, idTable);
};

let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
};

let setSortSelect = (arr, sortSelect) => {
    sortSelect.innerHTML = '';
    sortSelect.append(createOption('Нет', 0));
    for (let i in arr) {
        sortSelect.append(createOption(arr[i], Number(i) + 1));
    }
};

let setSortSelects = (data, dataForm) => {
    let head = [
        "Название",
        "Длина",
        "Ширина",
        "Максимальная глубина",
        "Расход воды",
        "Скорость течения",
        "Континент",
        "Страна истока"
    ];

    let allSelect = dataForm.getElementsByTagName('select');
    for (let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
        if (j > 0) {
            allSelect[j].disabled = true;
        }
    }
};

let changeNextSelect = (nextSelectId, curSelect) => {
    let nextSelect = document.getElementById(nextSelectId);
    
    if (curSelect.value == 0) {
        nextSelect.disabled = true;
        nextSelect.value = "0"; 
        document.getElementById(nextSelectId + "Desc").checked = false; 
        
        if (nextSelectId === "fieldsSecond") {
            let thirdSelect = document.getElementById("fieldsThird");
            thirdSelect.disabled = true;
            thirdSelect.value = "0";
            document.getElementById("fieldsThirdDesc").checked = false;
        }
    } else {

        nextSelect.disabled = false;
        nextSelect.innerHTML = curSelect.innerHTML;
        nextSelect.remove(curSelect.selectedIndex);

        if (nextSelectId === "fieldsThird") {
            let firstSelect = document.getElementById("fieldsFirst");
            if (firstSelect.value != 0 && firstSelect.value != curSelect.value) {
                for (let i = 0; i < nextSelect.options.length; i++) {
                    if (nextSelect.options[i].value === firstSelect.value) {
                        nextSelect.remove(i);
                        break;
                    }
                }
            }
        }
    }
};

let resetSubsequentSelects = (curSelectId) => {
    const selectIds = ["fieldsFirst", "fieldsSecond", "fieldsThird"];
    const currentIndex = selectIds.indexOf(curSelectId);
    
    for (let i = currentIndex + 1; i < selectIds.length; i++) {
        let select = document.getElementById(selectIds[i]);
        select.disabled = true;
        select.value = "0";
        document.getElementById(selectIds[i] + "Desc").checked = false;
    }
    if (curSelectId === "fieldsFirst" && document.getElementById("fieldsFirst").value != "0") {
        let secondSelect = document.getElementById("fieldsSecond");
        secondSelect.disabled = false;
        secondSelect.innerHTML = document.getElementById("fieldsFirst").innerHTML;
        secondSelect.remove(document.getElementById("fieldsFirst").selectedIndex);
    }
};

