//
//  Challenge.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit

class Challenge: NSObject {
    private var uid: Int
    private var fromUser: User
    private var desc: String
    private var revenge: Int
    private var date: NSDate
    
    init(uid: Int, fromUser: User, desc: String, date: NSDate) {
        revenge = 0
        self.uid = uid
        self.fromUser = fromUser
        self.desc = desc
        self.date = date
    }
    
    init(uid: Int, fromUser: User, desc: String, date: NSDate, revenge: Int) {
        self.revenge = revenge
        self.uid = uid
        self.fromUser = fromUser
        self.desc = desc
        self.date = date
    }
}
