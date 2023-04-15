export const groupBy = function(xs, f) {
    return xs.reduce(function(rv, x) {
        (rv[f(x)] = rv[f(x)] || []).push(x);
        return rv;
    }, {});
};