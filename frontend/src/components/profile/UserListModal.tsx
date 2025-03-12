import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { UserList } from "@/types";

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "followers" | "following";
  persons: UserList[];
  isLoading: boolean;
}

export default function UserListModal({ isOpen, onClose, type, persons, isLoading }: UserListModalProps) {
    return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === "followers" ? "Abonnés" : "Abonnements"}
    >
      <div className="space-y-4">
        {persons.map((person) => (
          <div key={person._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={person.avatar || ""} />
                <AvatarFallback>{person.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{person.username}</p>
                <p className="text-sm text-gray-500">@{person.identifier_name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-pink-300 hover:bg-pink-50"
            >
              {type === "followers" ? "Suivre" : "Ne plus suivre"}
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
  