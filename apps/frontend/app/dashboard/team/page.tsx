import TeamForm from "@/components/newteam";
import { useAuth } from "@clerk/nextjs";

export default function Team(){

    return(
        <div>
            <TeamForm></TeamForm>
        </div>
    )
}