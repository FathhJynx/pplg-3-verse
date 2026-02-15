import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, FileText, Coins, Hexagon, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Organization3DCard from "./Organization3DCard";
import OrganizationModal from "../modals/OrganizationModal";
import { api } from "../../services/api";
import SectionHeading from "../shared/SectionHeading";
import StatusTag from "../shared/StatusTag";
import { siteConfig } from "@/config/site";

interface OrgRole {
  title: string;
  name: string;
  icon: LucideIcon;
  tier: "gold" | "silver" | "bronze";
  description?: string;
  image?: string;
}

const roleConfig: Record<string, { icon: LucideIcon; tier: "gold" | "silver" | "bronze"; description: string }> = {
  'KM': { icon: Shield, tier: 'gold', description: "Class Prime Directive. Authority Level 1." },
  'Wakil KM': { icon: Users, tier: 'silver', description: "Executive Officer. Operational Support." },
  'Sekretaris': { icon: FileText, tier: 'bronze', description: "Data Keeper. Protocol Documentation." },
  'Bendahara': { icon: Coins, tier: 'bronze', description: "Resource Manager. Financial Logistics." },
};

const OrganizationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState<OrgRole | null>(null);
  const [orgRoles, setOrgRoles] = useState<OrgRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const students = await api.getStudents();
        const rolesToDisplay = ['KM', 'Wakil KM', 'Sekretaris', 'Bendahara'];

        const mappedRoles: OrgRole[] = students
          .filter(s => rolesToDisplay.includes(s.role))
          .map(s => {
            const config = roleConfig[s.role] || { icon: Users, tier: 'bronze', description: '' };
            return {
              title: s.role,
              name: s.nickname || s.full_name,
              icon: config.icon,
              tier: config.tier,
              description: s.bio_quote || config.description,
              image: s.avatar_url || undefined
            };
          })
          .sort((a, b) => rolesToDisplay.indexOf(a.title) - rolesToDisplay.indexOf(b.title));

        if (mappedRoles.length > 0) {
          setOrgRoles(mappedRoles);
        } else {
          // Static Fallback from siteConfig
          const fallbackRoles: OrgRole[] = (siteConfig as any).administration.map((admin: any) => {
            const config = roleConfig[admin.role] || { icon: Users, tier: 'bronze', description: '' };
            return {
              title: admin.title,
              name: admin.name,
              icon: config.icon,
              tier: config.tier,
              description: config.description
            };
          });
          setOrgRoles(fallbackRoles);
        }
      } catch (err) {
        console.error("Failed to fetch roles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);



  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 overflow-hidden bg-zinc-950"
    >
      <OrganizationModal
        isOpen={!!selectedRole}
        onClose={() => setSelectedRole(null)}
        role={selectedRole}
      />

      {/* Hexagon Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 25.98-15 25.98-15-25.98z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 flex justify-center">
          <StatusTag icon={Terminal} text="COMMAND STRUCTURE" />
        </div>

        <SectionHeading
          title="ADMINISTRATION"
          subtitle={`${siteConfig.name} // HIERARCHY`}
        />

        {/* 3D Card Stage */}
        <div
          className="flex flex-wrap justify-center items-center gap-8 perspective-1000"
        >
          {loading ? (
            <div className="text-primary font-mono animate-pulse">Initializing System...</div>
          ) : (
            orgRoles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connecting lines illusion could go here */}
                <Organization3DCard
                  role={role}
                  isActive={selectedRole?.title === role.title}
                  onClick={() => setSelectedRole(role)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default OrganizationSection;

