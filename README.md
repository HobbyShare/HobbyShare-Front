# Sprint8 HobbyShare

### 🎯 MVP claro (para el profe)

1. Login / registro
    
2. Crear evento (formulario simple)
    
3. Ver eventos en lista
    
4. Ver eventos en mapa
    
5. Ver eventos en calendario
    
6. Dashboard con 2–3 gráficos

## Arquitectura simple (Angular)

- `auth`  login, register, guards, service
    
- `events` crud, map, calendar, service
    
- `dashboard` graficos, service
    
- `shared` nav, home, botones, cosas que se repitan

- `core` servicesAuth, tokenService, Interceptors?

## División de trabajo (en pareja)

- Tú → Auth + Dashboard + Gráficos
    
- Tu compañero → Mapas + Calendario + CRUD eventos   

**Testing: ir haciendo al acabar cada componente/tarea, testing mas importante: 
    servicios, crud, auth, llamadas api, y presentacion de graficos, mapa i calendar


## 📌 User Stories (para el README / memoria)

### 👤 Autenticación

1. Como usuario quiero registrarme para poder crear y apuntarme a eventos.
    
2. Como usuario quiero iniciar sesión para acceder a mis eventos.
    

### 🎯 Eventos

3. Como usuario quiero crear un evento con título, descripción, fecha, categoría y ubicación.
    
4. Como usuario quiero ver una lista de eventos disponibles.
    
5. Como usuario quiero apuntarme a un evento.
    
6. Como usuario quiero ver solo los eventos a los que estoy apuntado. (Listado)
    

### 🗺️ Mapa

7. Como usuario quiero ver los eventos en un mapa para elegir por ubicación.
    

### 📅 Calendario

8. Como usuario quiero ver los eventos organizados por fecha en un calendario.
    

### 📊 Dashboard

9. Como usuario quiero ver estadísticas de uso (eventos por categoría, eventos por mes, etc). **Cuando toque hacerlo se comenta en detalle
    


Modelo de datos básico

### User

`interface User {   id: string; user: string;   name: string;   email: string;   category: string[]; createdAt: string; }`

### Event

`interface Event {   id: string;   title: string;   description: string;   category: string;   date: string;   lat: number;   lng: number;   creatorId: string; creatorUser: string;   participants: string[]; // ids de usuarios }`

## Versión backend (NestJS DTO)

`export class CreateUserDto {   userName: string;   name: string;   email: string;   password: string;   hobbies: string[]; }`


`export class createEventDto {   id: string;   title: string;   description: string;   category: string;   date: string;   lat: number;   lng: number;   creatorId: string; creatorUser: string;   participants: string[]; // ids de usuarios }`

🏷️ Tipos más usados

Tipo	Cuándo usarlo

feat	Nueva funcionalidad
fix	Arreglo de un bug
chore	Config, tareas, deps, cosas internas
docs	Cambios en documentación
style	Cambios solo de formato (sin lógica)
refactor	Refactor sin cambiar comportamiento
test	Tests


