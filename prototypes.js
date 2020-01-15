Date.prototype.yyyymmdd_hhmmss = function() {
    var mes = this.getMonth() + 1;
    var dia = this.getDate();
    var hh = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();
  
    return [
            this.getFullYear(),
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

Date.prototype.ddmmyyyy_hhmmss = function() {
    var mes = this.getMonth() + 1;
    var dia = this.getDate();
    var hh = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();
  
    return [
            (dia > 9 ? '' : '0') + dia,
            '/',
            (mes > 9 ? '' : '0') + mes,
            '/',
            this.getFullYear(),
            '_',
            (hh > 9 ? '' : '0') + hh,
            ':',
            (mm > 9 ? '' : '0') + mm,
            ':',
            (ss > 9 ? '' : '0') + ss
           ].join('');
};

Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    
    return "".concat(yyyy).concat('-').concat(mm).concat('-').concat(dd);
};
  
Date.prototype.yyyymmddhhmm = function() {
    var yyyymmdd = this.yyyymmdd();

    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    
    return "".concat(yyyymmdd).concat(' ').concat(hh).concat(':').concat(min);
};

Date.prototype.yyyymmddhhmmss = function() {
    var yyyymmddhhmm = this.yyyymmddhhmm();
    
    var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    
    return "".concat(yyyymmddhhmm).concat(':').concat(ss);
};