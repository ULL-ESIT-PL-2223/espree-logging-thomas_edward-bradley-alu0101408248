function foo(a, b) {
    console.log('Entering foo(${ a }, ${ b }) At line 1');
    var x = 'blah';
    var y = (e => {
        console.log('Entering <anonymous function>(${ e }) At line 3');
        return 3;
    })();
}
foo(1, 'wut', 3);