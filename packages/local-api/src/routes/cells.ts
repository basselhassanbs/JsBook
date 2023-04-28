import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);
  const newFileContent = [
    {
      content:
        "# JsBook\nThis is an interactive coding environment. You can write javascript, see it executed, and write comprehensive documentation using markdown.\n\n- Click any text cell (including this one) to edit it\n- The code in each code editor is all joined together into one file. If you define a variable in cell #1, you can refer to it in any following cell!\n- You can show any React component, string, number, or anything else by calling the `show` function. This is a function built into this environment. Call show multiple times to show multiple values\n- Re-order or delete cells using the buttons on the top right\n- Add new cells by hovering on the divider between each cell\n\nAll of your changes get saved to the file you opened JsBook with. So if you ran `npx jsnotbook serve test.js` , all of the text and code you write will be saved to the `test.js` file.\n",
      type: "text",
      id: "kkgj1",
    },
    {
      id: "ihkfi",
      type: "code",
      content:
        "import { useState } from 'react';\n\nconst Counter = () => {\n  const [counter, setCounter] = useState(0);\n  return (\n    <div>\n      <button onClick={() => setCounter(counter + 1)}>Click</button>\n      <h3>Count: {counter}</h3>\n    </div>\n  );\n};\n\nshow(<Counter/>);",
    },
  ];

  router.get("/cells", async (req, res) => {
    try {
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });

      res.send(JSON.parse(result));
    } catch (err: any) {
      if (err.code === "ENOENT") {
        await fs.writeFile(fullPath, JSON.stringify(newFileContent), "utf-8");
        res.send(JSON.stringify(newFileContent));
      } else {
        throw err;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });

  return router;
};
