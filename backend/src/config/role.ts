export enum Role {
    User = 'ROLE_USER',
    Moderator = 'ROLE_MODERATOR',
    Admin = 'ROLE_ADMIN'
  }

//iwant export array of roles
export const roles = Object.values(Role);

  // Mapping de la hiérarchie : chaque rôle hérite directement des rôles listés
  export const roleHierarchy: { [key in Role]: Role[] } = {
    [Role.User]: [],
    [Role.Moderator]: [Role.User],
    [Role.Admin]: [Role.Moderator, Role.User],
  };

  
  // Fonction récursive pour vérifier l'héritage transitif des rôles
  export function hasInheritedRole(currentRole: Role, requiredRole: Role): boolean {
    if (currentRole === requiredRole) return true;
    for (const inheritedRole of roleHierarchy[currentRole]) {
      if (hasInheritedRole(inheritedRole, requiredRole)) {
        return true;
      }
    }
    return false;
  }