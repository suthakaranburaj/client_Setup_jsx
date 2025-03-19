import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudCircleIcon from "@mui/icons-material/CloudCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import SearchIcon from "@mui/icons-material/Search";
import { MailIcon } from "lucide-react";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { asyncHandler, getCookie } from "./helper/commonHelper";
import ListItem from "@mui/material/ListItem";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  login_service,
  logout_service,
  get_current_user_service
} from "./services/authServices/authServices";

import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton
} from "@toolpad/core/Account";
import * as Pages from "./layout/index.js";
import { Outlet } from "react-router-dom";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items"
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />
  },
  {
    segment: "chatbot",
    title: "Chat Bot",
    icon: <SmartToyIcon />
  },
  {
    kind: "divider"
  },
  {
    kind: "header",
    title: "Analytics"
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "history",
        title: "History",
        icon: <DescriptionIcon />
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />
      }
    ]
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />
  }
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme"
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536
    }
  }
});

const MarkdownRenderer = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={materialLight}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table({ children }) {
          return <table className="markdown-table">{children}</table>;
        },
        a({ href, children }) {
          return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
        }
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

function ChatInterface() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/finance-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      
      // Add bot response
      setMessages(prev => [...prev, { 
        text: data.bot_response || data.error, 
        isBot: true 
      }]);
      
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, { 
        text: 'Error communicating with the assistant', 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 128px)',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      gap: 2
    }}>
      <List sx={{ 
        flexGrow: 1,
        overflow: 'auto',
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((msg, index) => (
          <ListItem 
            key={index}
            sx={{
              alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
              maxWidth: '80%',
              width: 'fit-content',
              alignItems: 'flex-start'
            }}
          >
            {msg.isBot && (
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>🤖</Avatar>
              </ListItemAvatar>
            )}
            <ListItemText
              primary={
                msg.isBot ? (
                  <MarkdownRenderer>{msg.text}</MarkdownRenderer>
                ) : (
                  msg.text
                )
              }
              sx={{
                bgcolor: msg.isBot ? 'action.selected' : 'primary.main',
                color: msg.isBot ? 'text.primary' : 'primary.contrastText',
                p: 2,
                borderRadius: 2,
                '& pre': {
                  backgroundColor: '#f5f5f5 !important',
                  padding: '1rem !important',
                  borderRadius: '4px !important',
                  overflowX: 'auto !important'
                },
                '& code': {
                  fontFamily: 'monospace !important',
                  backgroundColor: '#f5f5f5 !important',
                  padding: '0.2em 0.4em !important',
                  borderRadius: '3px !important'
                },
                '& table': {
                  borderCollapse: 'collapse !important',
                  width: '100% !important',
                  margin: '1rem 0 !important'
                },
                '& th, & td': {
                  border: '1px solid #ddd !important',
                  padding: '8px !important',
                  textAlign: 'left !important'
                },
                '& th': {
                  backgroundColor: '#f5f5f5 !important'
                }
              }}
            />
            {!msg.isBot && (
              <ListItemAvatar sx={{ minWidth: 'auto', ml: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>👤</Avatar>
              </ListItemAvatar>
            )}
          </ListItem>
        ))}
        {isLoading && (
          <ListItem sx={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>🤖</Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                bgcolor: 'action.selected',
                p: 2,
                borderRadius: 2,
                width: 'fit-content'
              }}
              primary={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </Box>
              }
            />
          </ListItem>
        )}
      </List>

      <Box sx={{ 
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        background: 'white'
      }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask financial questions..."
          disabled={isLoading}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          Send
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          Error: {error}
        </Typography>
      )}

      <style>{`
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          background: #666;
          border-radius: 50%;
          animation: typing 1.2s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </Box>
  );
}

function DemoPageContent({ pathname }) {
  if (pathname === '/chatbot') {
    return <ChatInterface />;
  }

  return (
    <Box sx={{
      py: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired
};

function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  /**
   * The handler used when the preview is expanded
   */
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  /**
   * The state of the Account popover
   * @default false
   */
  open: PropTypes.bool
};

const accounts = [
  // {
  //   id: 1,
  //   name: "Bharat Kashyap",
  //   email: "bharatkashyap@outlook.com",
  //   image: "https://avatars.githubusercontent.com/u/19550456",
  //   projects: [
  //     {
  //       id: 3,
  //       title: "Project X"
  //     }
  //   ]
  // },
  // {
  //   id: 2,
  //   name: "Bharat MUI",
  //   email: "bharat@mui.com",
  //   color: "#8B4513", // Brown color
  //   projects: [{ id: 4, title: "Project A" }]
  // }
];

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      {/* <Typography variant="body2" mx={2} mt={1}>
        Accounts
      </Typography> */}
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{
              justifyContent: "flex-start",
              width: "100%",
              columnGap: 2
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.95rem",
                  bgcolor: account.color
                }}
                src={account?.image ?? ""}
                alt={account.name ?? ""}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%"
              }}
              primary={account.name}
              secondary={account.email}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

function SidebarFooterAccount({ mini }) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);
  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: "left", vertical: "bottom" },
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.32)"})`,
                mt: 1,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  zIndex: 0
                }
              }
            }
          }
        }
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired
};

const demoSession = {
  user: {
    name: "Bharat Kashyap",
    email: "bharatkashyap@outlook.com",
    image: "https://avatars.githubusercontent.com/u/19550456"
  }
};

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <CloudCircleIcon fontSize="large" color="primary" />
      <Typography variant="h6">My App</Typography>
      <Chip size="small" label="BETA" color="info" />
      <Tooltip title="Connected to production">
        <CheckCircleIcon color="success" fontSize="small" />
      </Tooltip>
    </Stack>
  );
}

const NotificationBar = () => {
  return (
    <Stack spacing={2} direction="row" alignItems="center" sx={{ mr: 1 }}>
      <Tooltip
        title="Notifications"
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 10] // [horizontal, vertical] offset
              }
            }
          ]
        }}
      >
        <Badge badgeContent={4} color="primary">
          <Box sx={{ color: "text.primary" }}>
            <MailIcon fontSize="small" />
          </Box>
        </Badge>
      </Tooltip>
    </Stack>
  );
};

function ToolbarActionsSearch() {
  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div className="w-40">
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: "inline", md: "none" }
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="medium">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 }
          }
        }}
        sx={{
          display: { xs: "none", md: "inline-block" },
          mr: 1,
          width: "25vw"
        }}
      />
      <NotificationBar />
      <ThemeSwitcher />
    </Stack>
  );
}

function DashboardLayoutAccountSidebar(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState("/dashboard");

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path))
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = React.useState(null);
  const [authView, setAuthView] = React.useState(null);
  React.useEffect(() => {
    // console.log('hee2')
    const checkUser = async () => {
      // console.log('hell1')
      await handle_get_user();
    };
    checkUser();
  }, [authView]);

  const handle_get_user = async () => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    // console.log(accessToken,"ffff",refreshToken)
    // Only proceed if both tokens exist
    // console.log("hee");
    if (!accessToken || !refreshToken) {
      setSession(null);
      return;
    }

    try {
      const response = await get_current_user_service();
      if (response.data.data) {
        // console.log('heelo')
        setSession({
          user: response.data.data
        });
      }
      console.log("response", response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setSession(null);
    }
  };
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(demoSession);
      },
      signOut: () => {
        setSession(null);
      }
    };
  }, []);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={{
        signIn: () => setAuthView("login"), // Refresh user data on sign-in
        signOut: async () => {
          await logout_service();
          setSession(null);
        }
      }}
      session={session?.user ? session : null}
      // slots={{
      //   login: () => (
      //     <Pages.Login
      //       onSwitchToRegister={() => setAuthView("register")}
      //       onClose={() => setAuthView(null)}
      //     />
      //   )
      // }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: ToolbarActionsSearch,
          appTitle: CustomAppTitle,
          sidebarFooter: SidebarFooterAccount
        }}
      >
        <DemoPageContent pathname={pathname} />
        <Outlet />
      </DashboardLayout>
      {authView === "login" && (
        <Pages.Login
          onSwitchToRegister={() => setAuthView("register")}
          onClose={() => {
            setAuthView(null);
            handle_get_user();
          }}
        />
      )}
      {authView === "register" && (
        <Pages.Register
          onSwitchToLogin={() => setAuthView("login")}
          onClose={() => {
            setAuthView(null);
            handle_get_user();
          }}
        />
      )}
    </AppProvider>
  );
}

DashboardLayoutAccountSidebar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func
};

export default DashboardLayoutAccountSidebar;
