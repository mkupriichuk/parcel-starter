const sortMediaQueries = (a, b) => {
  let A = a.replace(/\D/g, '');
  let B = b.replace(/\D/g, '');

  if (/max-width/.test(a) && /max-width/.test(b)) {
    return B - A;
  } else if (/min-width/.test(a) && /min-width/.test(b)) {
    return A - B;
  } else if (/max-width/.test(a) && /min-width/.test(b)) {
    return 1;
  } else if (/min-width/.test(a) && /max-width/.test(b)) {
    return -1;
  }

  return 1;
};

module.exports = {
  plugins: {
    autoprefixer: {},
    'css-mqpacker': {
      sort: sortMediaQueries
    }
  }
}

