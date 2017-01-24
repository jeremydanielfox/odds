//
//  CompletedChallenge.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit

class CompletedChallenge: Challenge {
    private var upperBound: Int
    private var completor: User
    private var streetCredGained: Int
    //private var gifFile: ??
    private var dateCompleted: NSDate
    private var privacy: Int
    
    init(uid: Int, fromUser: User, completor: User, desc: String, date: NSDate, streetCredGained: Int, dateCompleted: NSDate, privacy: Int, upperBound: Int) {
        self.completor = completor
        self.streetCredGained = streetCredGained
        self.dateCompleted = dateCompleted
        self.privacy = privacy
        self.upperBound = upperBound
        super.init(uid: uid, fromUser: fromUser, desc: desc, date: date)
    }
    
    init(uid: Int, fromUser: User, completor: User, desc: String, date: NSDate, streetCredGained: Int, dateCompleted: NSDate, privacy: Int, upperBound: Int, revenge: Int) {
        self.completor = completor
        self.streetCredGained = streetCredGained
        self.dateCompleted = dateCompleted
        self.privacy = privacy
        self.upperBound = upperBound
        super.init(uid: uid, fromUser: fromUser, desc: desc, date: date, revenge: revenge)
    }
    
}
