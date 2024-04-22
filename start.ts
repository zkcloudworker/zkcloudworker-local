
async function main(args: string[]) {
  const name = args[0];
  const { run } = await import(`./src/${name}`);
  await run([name]);
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error);
});
