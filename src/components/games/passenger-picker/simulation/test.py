def getPlayersCommands(world)
    def findShortestPath(arr, pointA, pointB, charId)
        def heuristic(a,b)
            x = a.x - b.x
            y = a.y - b.y
            d = ( x*x + y*y )*( x*x + y*y )
            return d
        def removeFromArray(array, elt)
            array.remove(elt)
        #getting point on the map provided
        cellPointA = arr[pointA.y][pointA.x]
        cellPointB = arr[pointB.y][pointB.x]
        openSet = []
        closeSet = []
        path = []
        current = cellPointA
        openSet.append(cellPointA)
        
        while len(openSet)>0
            winner = 0
            for pos in openSet
                if pos.f < openSet[winner].f
                    winner = openSet.index(pos)
            current = openSet[winner]
            if current == cellPointB
                temp = current
                path.append(temp)
                while temp.previous[charId]
                    path.append(temp.previous[charId])
                    temp = temp.previous[charId]