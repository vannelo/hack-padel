export const gridStyles = {
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "black",
    borderBottom: "1px solid #52525b !important",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: "#d4d4d8",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-cell": {
    color: "white",
    borderColor: "transparent",
  },
  "& .MuiDataGrid-row": {
    "&:nth-of-type(odd)": {
      backgroundColor: "#111",
    },
  },
  "& .MuiTablePagination-root": {
    color: "#d4d4d8",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-columnSeparator": {
    color: "#52525b",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTopColor: "#52525b",
  },
  fontWeight: "bold",
  borderColor: "#52525b",
};

export const appRoutes = {
  admin: {
    home: "/admin",
    players: "/admin/jugadores",
    tournaments: "/admin/torneos",
  },
  ranking: {
    home: "/ranking",
    players: "/ranking/jugadores",
    tournaments: "/ranking/torneos",
    tournamentDetail: "/ranking/torneos/:id",
  },
};

export const ADMIN_MENU_ITEMS = [
  {
    label: "Jugadores",
    href: appRoutes.admin.players,
  },
  {
    label: "Torneos",
    href: appRoutes.admin.tournaments,
  },
];
