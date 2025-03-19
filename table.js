let createTable = (data, idTable) => {
    let table = document.getElementById(idTable);
    
    let tr = document.createElement('tr');
    const headers = [
        "Название",
        "Длина (км)",
        "Ширина (м)",
        "Максимальная глубина (м)",
        "Расход воды (м³/с)",
        "Скорость течения (м/с)",
        "Континент",
        "Страна истока"
    ];

    headers.forEach(headerText => {
        let th = document.createElement('th');
        th.innerHTML = headerText;
        tr.append(th);
    });
    
    table.append(tr);    
    
    data.forEach((item) => {
        let row = document.createElement('tr');
        const keys = ["Название", "Длина", "Ширина", "Максимальная глубина", "Расход воды", "Скорость течения", "Континент", "Страна истока"];
        keys.forEach(key => {
            let td = document.createElement('td');
            td.innerHTML = item[key] || "";
            row.append(td);
        });
        table.append(row);
    });    
};

let clearTable = (idTable) => {
    let table = document.getElementById(idTable);
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
};