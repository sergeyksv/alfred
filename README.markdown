After many improovements that we made for alfred codebase to make it working in real world app we give up ...
and build our own lightweight db engine. As we still not sure that in-proc database can work for us we make it upward
compatible with MongoDB API so you can switch to mature solution to any time or even make application to support 
both engines. Here it is: https://github.com/sergeyksv/tingodb 
