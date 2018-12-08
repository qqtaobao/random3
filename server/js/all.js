"use strict";var num=123,app=100;
"use strict";var num=123;function fn(){console.log(num)}fn();
"use strict";function fn(){var n=10;return function(){return n++}}var num=fn();num(),num();