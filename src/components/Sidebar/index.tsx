import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";

import DashboardContent from "@/pages/admin/dashboard";
import BerandaContent from "@/pages/admin/DaftarMahasiswa";
import SalesContent from "@/pages/admin/reports/CekKelayakanTA";
import TrafficContent from "@/pages/admin/reports/PelaksanaanSeminar";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard Admin",
    icon: <DashboardIcon />,
  },
  {
    segment: "DaftarMahasiswa",
    title: "Daftar Mahasiswa",
    icon: <PeopleIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "CekKelayakanTA",
        title: "Cek Kelayakan TA",
        icon: <DescriptionIcon />,
      },
      {
        segment: "PelaksanaanSeminar",
        title: "Pelaksanaan Seminar",
        icon: <AccessTimeIcon />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  switch (pathname) {
    case "/dashboard":
      return <DashboardContent />;
    case "/DaftarMahasiswa":
      return <BerandaContent />;
    case "/reports/CekKelayakanTA":
      return <SalesContent />; // Sales content view
    case "/reports/PelaksanaanSeminar":
      return <TrafficContent />; // Traffic content view
    default:
      return (
        <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            No Content Found
          </Typography>
        </Box>
      );
  }
}

interface DemoProps {
  window?: () => Window;
  children?: ReactNode; // Make children optional
}

export default function SidebarAdmin(props: DemoProps) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <div id="admin-root">
      <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme} window={demoWindow}>
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    </div>
  );
}
