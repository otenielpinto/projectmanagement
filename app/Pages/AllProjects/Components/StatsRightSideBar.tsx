import React, { useMemo } from "react";

import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import { useContextApp } from "@/app/contextApp";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Project } from "@/app/Data/AllProjects";
import ListAltIcon from "@mui/icons-material/ListAlt";

function StatsRightSideBar() {
  //   {
  //     id: uuidv4(),
  //     clerkUserId: "123",
  //     title: "AProject Title Title Title Title",
  //     createdAt: "2024-08-26T10:00:00Z",
  //     updatedAt: "2024-08-28T14:30:00Z",
  //     icon: "LocalLibrary",
  //     tasks: [
  //       {
  //         id: uuidv4(),
  //         title: "Create the UI Design of the task",
  //         icon: "Movie",
  //         projectName: "Project",
  //         status: "In Progress",
  //         priority: "Low",
  //         createdAt: "2024-08-26T10:00:00Z",
  //         updatedAt: "2024-08-28T14:30:00Z",
  //       },
  //       {
  //         id: uuidv4(),
  //         title: "Develop the Backend API",
  //         icon: "Code",
  //         projectName: "Project",
  //         status: "In Progress",
  //         priority: "High",
  //         createdAt: "2024-08-26T11:00:00Z",
  //         updatedAt: "2024-08-28T15:00:00Z",
  //       },
  //       {
  //         id: uuidv4(),
  //         title: "Write Unit Tests",
  //         icon: "BugReport",
  //         projectName: "Project",
  //         status: "In Progress",
  //         priority: "Medium",
  //         createdAt: "2024-08-26T12:00:00Z",
  //         updatedAt: "2024-08-28T16:00:00Z",
  //       },
  //     ],
  //   },

  // ];

  const {
    allProjectsObject: { allProjects },
  } = useContextApp();

  const { completedProjects, completedTasks, completionPercentage } =
    useMemo(() => {
      let completedProjects: Project[] = [];
      let totalTasks = 0;
      let completedTasks = 0;

      allProjects.forEach((project) => {
        const projectCompleted = project.tasks.every(
          (task) => task.status === "Completed"
        );
        if (projectCompleted) completedProjects.push(project);

        project.tasks.forEach((task) => {
          totalTasks++;
          if (task.status === "Completed") completedTasks++;
        });
      });

      const percentage =
        completedProjects.length > 0
          ? Math.round((completedProjects.length / allProjects.length) * 100)
          : 0;

      return {
        completedProjects: completedProjects,
        completedTasks,
        completionPercentage: percentage,
      };
    }, [allProjects]);

  return (
    <div className=" w-[22%] flex justify-end items-center max-lg:hidden">
      {/* White background */}
      <div className="h-[92%] w-[94%]  bg-white rounded-l-3xl p-3 flex flex-col ">
        {/* Header */}
        <Header />
        {/* Circular Chart and the labals */}
        <div className="flex flex-col gap-11 items-center justify-center mt-6   ">
          <CircularChart percentage={completionPercentage} />
          <ProjectsCompletedLabels
            completedProjects={completedProjects}
            completedTasks={completedTasks}
          />
        </div>
        {/* Projects List */}
        <ProjectsList completedProjects={completedProjects} />
      </div>
    </div>
  );

  function Header() {
    return (
      <h2 className="text-[22px] font-bold text-center mt-7 ">
        Projects Completed
      </h2>
    );
  }

  function CircularChart({ percentage }: { percentage: number }) {
    return (
      <div className="w-40 h-40 mt-7 mb-1">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textSize: "16px",
            pathColor: `rgba(234, 88, 12, 2)`,
            textColor: "#f97316",
            trailColor: "#f1f5f9",
            backgroundColor: "#3e98c7",
          })}
        />
      </div>
    );
  }

  function ProjectsCompletedLabels({
    completedProjects,
    completedTasks,
  }: {
    completedProjects: Project[];
    completedTasks: number;
  }) {
    return (
      <div className="flex justify-center flex-col gap-1 items-center">
        <p className="font-bold text-[17px] ">
          {completedProjects.length} Completed
        </p>
        <p className=" text-[13px] text-slate-400">
          {completedTasks} Tasks done
        </p>
      </div>
    );
  }

  function ProjectsList({
    completedProjects,
  }: {
    completedProjects: Project[];
  }) {
    const projectsWithTasks = completedProjects.filter(
      (project) => project.tasks.length > 0
    );

    console.log(completedProjects);

    return (
      <ul className="flex flex-col gap-3 mt-6   mx-4 overflow-auto ">
        <div className="  h-[100%] flex items-center justify-center py-20 w-full">
          {projectsWithTasks.length === 0 ? (
            <div
              className={`p-1 gap-5 flex flex-col justify-center opacity-40 mt-6  pb-8 items-center`}
            >
              <NotAchievedProjectsIcon />
              <div className=" flex flex-col items-center gap-2">
                <p className="    text-slate-700 text-[12px]    mb-1 text-center">
                  {`No Projects accomplished Yet...`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {projectsWithTasks.map((project, index) => (
                <div key={project.id}>
                  <SingleProject project={project} />
                  {index < completedProjects.length - 1 && (
                    <hr className="w-[80%] mx-auto text-slate-100 opacity-50" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ul>
    );

    function SingleProject({ project }: { project: Project }) {
      const {
        chosenProjectObject: { setChosenProject },
        sideBarMenuObject: { setSideBarMenu },
        tabsOptionsObject: { setTabsOptions },
      } = useContextApp();
      function openTheProject() {
        //Go the the all tasks page
        setSideBarMenu((prev) =>
          prev.map((menu) => ({
            ...menu,
            isSelected: menu.id === 2 ? true : false,
          }))
        );

        // Select the completed tasks tab
        setTabsOptions((prev) =>
          prev.map((option) => ({
            ...option,
            isSelected: option.id === 2 ? true : false,
          }))
        );
        //
        setChosenProject(project);
      }
      return (
        <li onClick={openTheProject} className="  p-3 flex gap-2 items-center">
          <div className="w-8 h-8 bg-orange-600 rounded-md justify-center items-center flex text-white">
            <SplitscreenIcon sx={{ fontSize: "19px" }} />
          </div>

          <ul>
            <li className="text-[14px] font-semibold cursor-pointer hover:text-orange-600 select-none">
              {truncateString(project.title, 40)}
            </li>
            <li className="text-[12px]   text-slate-400">
              {project.tasks.length} tasks
            </li>
          </ul>
        </li>
      );
    }
  }
}

export default StatsRightSideBar;

function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
}

function NotAchievedProjectsIcon() {
  return (
    <svg
      fill="#94a3b8"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488.765 488.766"
      height={"90px"}
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g>
          {" "}
          <g>
            {" "}
            <path d="M406.959,87.047l0.046-0.962c0.188-3.994-1.122-7.869-3.504-10.364c-2.098-2.194-4.891-3.311-8.303-3.311h-57.341 l-0.03-2.569c-0.046-3.458-0.071-6.911-0.071-10.374c0-1.147-0.146-2.293-0.481-3.598l-0.097-0.378l0.021-0.391 c0.197-3.999-1.103-7.884-3.489-10.395c-2.097-2.204-4.896-3.323-8.317-3.323c-10.837,0-21.673-0.046-32.499-0.094l-2.539-0.01 l-0.051-2.536c-0.219-11.278-0.944-20.67-2.285-29.557c-0.863-5.692-6.865-9.095-12.183-9.095l-0.726,0.005l-0.62-0.065L223.822,0 c-3.758,0-6.863,1.409-8.98,4.088c-2.542,3.22-3.473,7.987-2.417,12.449l0.183,0.764l-0.277,0.744 c-0.576,1.549-0.873,3.087-0.873,4.575v17.514l-2.684-0.084c-11.022-0.337-22.046-0.724-33.071-1.257l-0.536-0.018 c-1.051,0-2.079,0.147-3.255,0.46l-0.343,0.091l-0.358-0.005h-0.005c-6.167,0-12.621,3.885-12.71,12.418 c-0.046,4.373-0.213,8.737-0.478,13.084l-0.147,2.438l-2.443,0.005c-18.943,0.053-39.212,0.401-59.074,2.549 c-0.678,0.071-1.274,0.239-1.879,0.401l-0.825,0.124c-6.215,0-12.428,3.832-12.428,12.401v49.139c0,2.755,0.69,5.19,2.054,7.221 l0.442,0.658v0.79c-0.021,110.512-0.411,210.279-4.992,312.123c-0.058,1.239,0.079,2.474,0.401,3.87l0.125,0.527l-0.099,0.538 c-0.62,3.402-0.074,6.511,1.543,8.766c1.455,2.036,3.75,3.3,6.797,3.757c99.894,14.817,198.458,16.026,307.71,16.036l0.011,2.601 v-2.601c7.886,0,10.471-6.012,11.212-8.592l0.167-0.578l0.406-0.447c2.026-2.234,3.053-5.078,3.053-8.47V95.672 c0-3.093-0.844-5.738-2.504-7.866L406.959,87.047z M236.177,25.834h29.097l0.111,2.476c0.168,3.364,0.265,6.733,0.29,10.103 l0.015,2.641l-9.079-0.091c-5.962-0.059-11.921-0.117-17.88-0.219l-2.554-0.048V25.834z M179.182,120.097 c0.927-7.01,1.811-23.976,2.511-37.61c0.322-6.276,0.609-11.758,0.838-15.074l0.178-2.529l2.526,0.109 c43.132,1.851,85.695,2.153,125.273,2.196h2.569l0.025,2.567c0.295,27.784,0.838,47.174,1.549,54.598l0.279,2.966l-2.976-0.119 c-22.638-0.927-45.677-1.572-67.951-2.191c-20.784-0.582-41.563-1.163-62.342-1.97l-2.849-0.109L179.182,120.097z M385.333,460.309h-2.601c-98.075-0.062-186.598-1.117-276.721-13.497l-2.341-0.32l0.099-2.366 c4.296-100.585,4.654-200.923,4.659-312.25c0-2.762-0.69-5.2-2.059-7.238l-0.437-0.655V94.737l2.407-0.178 c15.991-1.181,31.864-1.399,43.896-1.455l2.965-0.015l-0.37,2.947c-0.114,0.914-0.259,7.774-0.374,13.284 c-0.188,9.039-0.292,13.416-0.442,14.492c-0.322,2.397-0.233,4.764,0.27,7.025l0.109,0.511l-0.094,0.521 c-0.78,4.288,0.292,8.901,2.792,12.037c2.133,2.682,5.205,4.189,8.882,4.357c26.141,1.195,52.747,1.904,78.478,2.584 c25.753,0.681,52.382,1.389,78.569,2.59l0.68,0.016c7.896,0,10.08-6.307,10.659-9.021l0.198-0.957l0.781-0.589 c3.534-2.641,5.373-6.302,4.926-9.795c-0.244-1.924-0.432-9.044-0.665-18.89c-0.137-5.758-0.284-11.71-0.401-13.137l-0.243-2.823 h46.372v362.067H385.333z"></path>{" "}
            <path d="M336.594,354.788c-15.265-16.864-30.428-33.809-45.077-51.196l44.3-44.3c4.915-4.916,3.361-11.213-0.594-14.869 c-0.351-0.611-0.762-1.216-1.255-1.792c-10.811-12.604-22.516-24.361-34.251-36.102c-10.567-10.573-21.576,10.092-28.157,16.219 c-13.431,12.489-17.402,15.993-30.828,28.49c-12.396-12.492-28.472-28.927-40.225-42.033c-2.803-3.128-6.167-3.842-9.194-3.052 c-2.516-0.13-5.146,0.729-7.472,3.052l-30.549,30.549c-4.743,4.74-3.473,10.773,0.163,14.48c0.452,0.751,0.983,1.482,1.683,2.184 c13.371,13.375,25.246,30.655,38.012,44.604c-16.11,17.356-27.444,34.327-43.44,51.795c-5.814,6.358-1.856,14.696,4.134,17.286 c9.224,10.76,19.177,20.84,29.193,30.858c3.707,3.707,8.193,3.723,11.751,1.823c1.389-0.518,2.742-1.381,3.994-2.752 c15.704-17.22,32.037-33.819,48.484-50.312c13.998,16.803,28.531,33.128,43.166,49.388c3.899,4.337,8.851,4.027,12.517,1.483 c1.732-0.315,3.459-1.046,5.073-2.407c11.689-9.882,18.809-16.768,30.433-26.73c5.372-4.601,3.828-10.806-0.3-14.452 C337.731,356.251,337.239,355.504,336.594,354.788z M299.458,377.853c-14.721-16.412-29.335-32.936-43.279-50.028 c-2.879-3.52-6.441-4.129-9.603-3.037c-2.392-0.025-4.872,0.838-7.066,3.037c-16.661,16.666-33.243,33.403-49.279,50.663 c-6.162-6.23-12.152-12.624-17.971-19.18c15.882-17.031,26.921-33.718,42.609-50.922c4.456-4.896,3.141-10.959-0.416-14.686 c-0.391-0.681-0.858-1.341-1.438-1.98c-12.53-13.995-24.272-31.24-37.521-44.544l16.402-16.399 c12.708,13.814,29.706,31.004,43,44.298c14.78,14.726,53.562-50.153,59.093-44.531c6.773,6.878,13.497,13.814,19.936,21.01 l-42.137,42.138c-0.909,0.908-1.533,1.878-2.036,2.854c-2.793,3.777-3.585,9.231,0.183,13.812 c14.894,18.067,30.463,35.546,46.148,52.934C309.264,369.407,306.33,371.784,299.458,377.853z"></path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}