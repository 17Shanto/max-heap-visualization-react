# Heap Sort Visualizer

A web application designed to visualize the Heap Sort algorithm with an interactive and user-friendly interface. By default, the application loads with 30 data points, allowing you to watch the sorting process in real-time.



## 🔗 Live Link
Check out the live application here: **[Heap Sort Visualizer](https://whimsical-froyo-4979be.netlify.app/)**

## Demo
<table width="100%">
  <tr>
    <td width="50%" align="center">
      <b>1. Play & Visualization</b><br>
      <img src="https://github.com/user-attachments/assets/6fc38046-d6a7-44d7-ad13-7085b3d9c107" width="100%" />
      <br>
      <i>Controls to play, pause, speed, and animate, Manually step forward through the sort.</i>
    </td>
    <td width="50%" align="center">
      <b>2. Add Custom Data</b><br>
      <img src="https://github.com/user-attachments/assets/8c2eb377-f200-4699-87e2-a242dc780fba" width="100%" />
      <br>
      <i>Input custom weight to visualize.</i>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>3. Clickavle Nodes</b><br>
      <img src="https://github.com/user-attachments/assets/1419bad7-3bbb-42e7-a0a9-44e02afc1908" width="100%" />
      <br>
      <i>Click on node for more detailes</i>
    </td>
    <td align="center">
      <b>4. Extract Max & Export JSON</b><br>
      <img src="https://github.com/user-attachments/assets/59698c3e-6fb4-4ec5-b9d2-38b2abe84c0a" width="100%" />
      <br>
      <i>Visualize extracting the root node and Export the sorted list as JSON or reset the board.</i>
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <b>5. Toggle Theme & Reset</b><br>
      <img src="https://github.com/user-attachments/assets/3e0e7049-74f2-4915-9cc5-45db9152609f" width="40%" />
      <br>
      <i>Toggle dark and light theme and reset data</i>
    </td>
  </tr>
</table>

## Features

This visualizer comes packed with tools to help you understand the algorithm:

* **Play & Pause Control:** Start and stop the Heap Sort animation at any time.
* **Interactive Nodes:** Clickable nodes for better engagement.
* **Step-by-Step Navigation:** Manually move forward through the sorting steps to analyze the algorithm in detail.
* **Dynamic Data:** Add your own custom data to the visualizer.
* **Extract Max Animation:** Visualize the "Extract Max" phase in a descending order heap sort.
* **Export Data:** Save the final sorted list as a JSON file.
* **Speed Control:** Adjust the animation speed to your preference.
* **Reset:** Quickly reset the visualizer to the start state.

---

## Technologies Used

This project leverages a modern, robust, and type-safe stack:

* **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (built on [Radix UI](https://www.radix-ui.com/) primitives)
* **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
* **State Management:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (Validation)
* **Testing:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)
* **Other Tools:** `date-fns`, `recharts`, `sonner` (Toasts)

## How to Run Locally

Follow these steps to get a copy of the project up and running on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone [git repo url]
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd [project-folder-name]
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development server:**
    ```bash
    npm start
    ```

Open [http://localhost:8080](http://localhost:8080/) to view it in your browser.
