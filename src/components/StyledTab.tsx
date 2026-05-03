import { Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

interface StyledTabProps {
  label: string;
  value: string | number;
}

export const AntTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#066aba",
  },
});

export const AntTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  minWidth: 72,
  fontSize: 14,
  fontWeight: theme.typography.fontWeightRegular,
  "&:hover": {
    color: "#066aba",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#066aba",
    fontWeight: theme.typography.fontWeightMedium,
  },
  "&:focus": {
    color: "#066aba",
  },
}));
