/* eslint-env node */
const brandId = process.env.BRAND_ID;
const { execSync } = require("child_process");

if (!brandId) {
  throw new Error("BRAND_ID environment variable is not set");
}

function zcli(command) {
  try {
    console.log(`Executing command: yarn --silent zcli ${command}`);
    const data = execSync(`yarn --silent zcli ${command} --json`);
    return JSON.parse(data.toString());
  } catch (error) {
    console.error(`Error executing command: yarn --silent zcli ${command}`);
    console.error("Error message:", error.message);
    console.error(
      "stdout:",
      error.stdout ? error.stdout.toString() : "No stdout"
    );
    console.error(
      "stderr:",
      error.stderr ? error.stderr.toString() : "No stderr"
    );
    throw error;
  }
}

try {
  const { themeId } = zcli(`themes:import --brandId=${brandId}`);
  console.log(`Imported theme with ID: ${themeId}`);

  zcli(`themes:publish --themeId=${themeId}`);
  console.log(`Published theme with ID: ${themeId}`);

  const { themes } = zcli(`themes:list --brandId=${brandId}`);
  console.log(`Fetched list of themes for brandId ${brandId}`);

} catch (error) {
  console.error(
    "An error occurred during the theme upload process:",
    error.message
  );
}
