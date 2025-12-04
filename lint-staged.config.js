module.exports = {
  "**/*.{ts,js}": (filenames) => [
    // rodar eslint fix nos arquivos ts/js staged
    `eslint --fix ${filenames.join(" ")}`,
    // rodar prettier naqueles arquivos
    `prettier --write ${filenames.join(" ")}`,
  ],
  "**/*.{json,md}": ["prettier --write"],
};
