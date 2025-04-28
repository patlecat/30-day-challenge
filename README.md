# Hackergarten Challenge, March 2025
The idea was to create a webapp in 1 evening together, using a nocode AI tool (TempoLabs) to see how far can we get with it and what works well and saves time and what doesn't?

## Goal
Design and code a 30-Day-Challenge webapp that lets the user create a personal challenge and define what the goals are. Example would be like a 30 day reading books or running thing.
Then invite registered friends to participate in it and compare daily achievements. At the end one would be the winner.

## The Tool(s)
We mainly used the IDE (in the browser) from [Tempo Labs](https://www.tempo.new/) which also generously sponsored this event by giving us free tokens to use. For the database and
authentication we used a free Supabase account (online).

## Conclusion
As you can see the tool really got very far with only a few hours of working. We almost completed it. The connection between registered users and the end of challenge processes weren't done.
Everything else was quite usable.

As long as you stay within a small and clearly defined range of tasks you can advance fast with such nocode tools. Simplified authentication via Supabase, storing data in the db and creating a
pleasing webdesign can be quick and painless if you're flexible in your expectations and can adapt to what the AI presents you. The more business logic and technical features you add the
more difficult it gets to manage it all. Tempo Labs has interesting approaches with a Kanban board where you can assign tasks to different people and each task represents a Git branch. But
this also has it's own problems and could add complexity in the process to coordinate it properly. The design is usually pleasing if you give the AI some hints what style and component
collection you want to use. But you rarely get exactly what you wanted. It's just not possible by prompts alone. But this isn't always bad, since the AI can propose you solutions that are
far more elaborate than what you had in mind.

## Thanks
My thanks go to Alexis Darrasse and Andrii Prokovskyi for participating in this experiment at Hackergarten Zürich
