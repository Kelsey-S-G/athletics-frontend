import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, UserCheck, Trophy, ChevronRight } from "lucide-react";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/recruit/get_teams");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // If the response is an error object
        if (data.error) {
          throw new Error(data.error);
        }
        
        setTeams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Group teams by sport
  const teamsBySport = teams.reduce((acc, team) => {
    const sport = team.sportName;
    if (!acc[sport]) {
      acc[sport] = [];
    }
    acc[sport].push(team);
    return acc;
  }, {});

  const TeamCard = ({ team }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-red-800" />
      <CardHeader className="space-y-1 pl-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-red-800">
            {team.sportName}
          </span>
        </div>
        <CardTitle className="text-2xl font-extrabold flex items-center group-hover:text-red-800 transition-colors">
          {team.name}
          <ChevronRight className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pl-6">
        <div className="space-y-3">
          {team.coach_name && (
            <div className="flex items-center gap-3 text-gray-700">
              <UserCheck className="h-5 w-5 text-red-800" />
              <span className="font-medium">Coach: {team.coach_name}</span>
            </div>
          )}
          {team.team_email && (
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="h-5 w-5 text-red-800" />
              <span className="font-medium">{team.team_email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-xl font-semibold text-gray-700">Loading teams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="bg-gray-200 p-16">
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-white shadow-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-red-800 data-[state=active]:text-white"
            >
              ALL TEAMS ({teams.length})
            </TabsTrigger>
            <TabsTrigger
              value="sports"
              className="data-[state=active]:bg-red-800 data-[state=active]:text-white"
            >
              BY SPORT ({Object.keys(teamsBySport).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
              {teams.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-600">
                  No teams found
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sports" className="space-y-8">
            {Object.entries(teamsBySport).map(([sport, sportTeams]) => (
              <div key={sport} className="mb-12">
                <h2 className="text-2xl font-bold text-red-800 mb-6 border-b pb-2">
                  {sport} Teams
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sportTeams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(teamsBySport).length === 0 && (
              <div className="text-center py-8 text-gray-600">
                No teams found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Teams;
