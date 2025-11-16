import Typography from "@renderer/components/ui/Typography";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs";
import { UserRound, Key } from "lucide-react";
import GeneralTab from "@renderer/components/settings/GeneralTab";
import AdminsTab from "@renderer/components/settings/AdminsTab";

const Settings = (): React.JSX.Element => {
  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-7">
      <header>
        <Typography variant="h1" className="font-normal">
          Settings
        </Typography>
        <Typography
          variant="p"
          className="text-TEXTdark/60 dark:text-TEXTlight/60"
        >
          Manage and configure admin settings
        </Typography>
      </header>

      <div>
        <Tabs defaultValue="general" className="mt-6 w-full">
          <TabsList className="bg-card border-border grid w-full grid-cols-2 rounded-lg border shadow-lg">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-TEXTlight dark:data-[state=active]:text-TEXTdark rounded-lg"
            >
              <UserRound className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="admins"
              className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-TEXTlight dark:data-[state=active]:text-TEXTdark rounded-lg"
            >
              <Key className="mr-2 h-4 w-4" />
              Admin Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <GeneralTab />
          </TabsContent>

          <TabsContent value="admins" className="mt-6">
            <AdminsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
