function foo(a, b) { 
  var x = 'blah';   
  var y = (() => { return 3 })();
}     
foo(1, 'wut', 3);