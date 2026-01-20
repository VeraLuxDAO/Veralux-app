import { useMemo, memo } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Member } from "@/lib/circles-mock-data";
import { Circle } from "@/lib/circles-data";

interface MembersListProps {
  circle: Circle;
  members: Member[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMemberClick: (member: Member) => void;
}

export const MembersList = memo(function MembersList({
  circle,
  members,
  searchQuery,
  onSearchChange,
  onMemberClick,
}: MembersListProps) {
  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const onlineMembers = useMemo(() => {
    return filteredMembers.filter(
      (member) => member.status === "online" || member.status === "idle"
    );
  }, [filteredMembers]);

  const offlineMembers = useMemo(() => {
    return filteredMembers.filter(
      (member) => member.status === "offline"
    );
  }, [filteredMembers]);

  return (
    <>
      {/* Members Header */}
      <div className="px-4 py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center">
              <Users className="h-3 w-3 text-white" />
            </div>
            <h3 className="text-[16px] font-semibold text-white font-['Geist']">
              Members
            </h3>
          </div>
        </div>
        <p className="text-[12px] text-[#9BB6CC] ml-7">
          {circle.memberCount}&nbsp; • <span className="text-[#45D4A7]">{circle.onlineMembers}</span>&nbsp;Online
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BB6CC99]" />
          <Input
            placeholder="Search Members"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-3 h-9 bg-[rgba(229,247,253,0.06)] border border-white/10 rounded-full text-sm text-white placeholder:text-[#9BB6CC99] focus:ring-0 focus:border-white/30 font-['Geist']"
          />
        </div>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="px-2 py-6">
          {onlineMembers.length > 0 && (
            <div className="mb-4">
              <h4 className="text-[10px] font-semibold text-[#E5F7FD66] uppercase tracking-wide px-2 mb-2">
                ONLINE
              </h4>
              <div className="space-y-0.5">
                {onlineMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => onMemberClick(member)}
                    className="flex items-center gap-2 px-2 py-[6px] rounded-[30px] hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10"
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2",
                          member.status === "online"
                            ? "bg-[#3ba55d] border-[#2b3642]"
                            : "bg-[#faa81a] border-[#2b3642]"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-[#9BB6CC] truncate">
                        {member.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {offlineMembers.length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold text-[#E5F7FD66] uppercase tracking-wide px-2 mb-2">
                OFFLINE
              </h4>
              <div className="space-y-0.5">
                {offlineMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => onMemberClick(member)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-[30px] hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10"
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-[#2b3642] text-white text-sm">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-[#9BB6CC99] truncate">
                        {member.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredMembers.length === 0 && (
            <div className="px-2 py-4 text-center">
              <p className="text-xs text-[#9BB6CC]">No members found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
});
