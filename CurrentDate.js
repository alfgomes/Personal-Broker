exports.yyyymmdd_hhmmss = function() {
    var now = new Date();
    var mes = now.getMonth() + 1;
    var dia = now.getDate();
    var hh = now.getHours();
    var mm = now.getMinutes();
    var ss = now.getSeconds();
  
    return [
            now.getFullYear(),
            '-',
            (mes > 9 ? '' : '0') + mes,
            '-',
            (dia > 9 ? '' : '0') + dia,
            '_',
            (hh > 9 ? '' : '0') + hh,
            ':',
            (mm > 9 ? '' : '0') + mm,
            ':',
            (ss > 9 ? '' : '0') + ss
           ].join('');
};

exports.ss = function() {
    return new Date().getSeconds();
};