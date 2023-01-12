const util = {
    trans: function(name)
    {
        switch(name)
        {
            case '김해':
                name = 'NAARKPK';
                break;
            case '제주':
                name = 'NAARKPC';
                break;
            case '무안':
                name = 'NAARKJB';
                break;
            case '광주':
                name = 'NAARKJJ';
                break;
            case '군산':
                name = 'NAARKJK';
                break;
            case '여수':
                name = 'NAARKJY';
                break;
            case '원주':
                name = 'NAARKNW';
                break;
            case '양양':
                name = 'NAARKNY';
                break;
            case '사천':
                name = 'NAARKPS';
                break;
            case '울산':
                name = 'NAARKPU';
                break;
            case '인천':
                name = 'NAARKSI';
                break;
            case '김포':
                name = 'NAARKSS';
                break;
            case '포항':
                name = 'NAARKTH';
                break;
            case '대구':
                name = 'NAARKTN';
                break;
            case '청주':
                name = 'NAARKTU';
                break;
        }
        return name;

    }
}
module.exports = util;