module.exports = {
  login: {
    host: '209.59.104.229',
    user: 'admin',
    password: 'arp1t123'
  },
  line: function (number) {
    var split_num = number.toString().split('');
    switch (split_num[0]) {
      case '2':
        return '1';
      case '3':
      case '6':
        return '2';
      case '7':
        return split_num[3] == '2' ? '1' : '2';
      default:
        return '2';
    }
  }
};
