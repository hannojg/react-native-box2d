export interface b2Vec2 {
  x: number;
  y: number;
}

export interface b2BodyDef {
  /**
   * The world angle of the body in radians.
   **/
  angle: number;
  /**
   * The linear velocity of the body's origin in world co-ordinates.
   **/
  linearVelocity: b2Vec2;
  /**
   * The world position of the body. Avoid creating bodies at the origin since this can lead to many overlapping shapes.
   **/
  position: b2Vec2;
  /**
   * The body type: static (0), kinematic (1), or dynamic (2).
   * @note If a dynamic body would have zero mass, the mass is set to one.
   **/
  type: number;
}

export interface b2Shape {}

export interface b2PolygonShape extends b2Shape {
  /**
   * Build vertices to represent an axis-aligned box.
   * @param hx The half-width.
   * @param hy The half-height.
   * @return Box polygon shape.
   **/
  SetAsBox(hx: number, hy: number): void;
}

export interface b2FixtureDef {
  /**
   * The density, usually in kg/m^2.
   **/
  density: number;

  /**
   * The friction coefficient, usually in the range [0,1].
   **/
  friction: number;

  /**
   * The shape, this must be set. The shape will be cloned, so you can create the shape on the stack.
   **/
  shape: b2Shape;
}

export interface b2Body {
  /**
   * Apply a force to the center of mass. This wakes up the body.
   * @param force the world force vector, usually in Newtons (N).
   * @param wake also wake up the body
   **/
  ApplyForceToCenter(force: b2Vec2, wake: boolean): void;

  /**
   * Apply an impulse to the center of mass. This immediately modifies the velocity.
   * @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
   * @param wake also wake up the body
   **/
  ApplyLinearImpulseToCenter(impule: b2Vec2, wake: boolean): void;

  /**
   * Creates a fixture and attach it to this body. Use this function if you need to set some fixture parameters, like friction. Otherwise you can create the fixture directly from a shape. If the density is non-zero, this function automatically updates the mass of the body. Contacts are not created until the next time step.
   * @warning This function is locked during callbacks.
   * @param def The fixture definition;
   * @return The created fixture.
   **/
  CreateFixture(def: b2FixtureDef): void;

  /**
   * Creates a fixture from a shape and attach it to this body. This is a convenience function. Use b2FixtureDef if you need to set parameters like friction, restitution, user data, or filtering. This function automatically updates the mass of the body.
   * @warning This function is locked during callbacks.
   * @param shape The shaped of the fixture (to be cloned).
   * @param density The shape density, default is 0.0, set to zero for static bodies.
   * @return The created fixture.
   **/
  CreateFixture2(shape: b2Shape, density?: number): void;

  /**
   * Get the angle in radians.
   * @return The current world rotation angle in radians
   **/
  GetAngle(): number;

  /**
   * Get the linear velocity of the center of mass.
   * @return The linear velocity of the center of mass.
   **/
  GetLinearVelocity(): b2Vec2;

  /**
   * Get the world body origin position.
   * @return World position of the body's origin.
   **/
  GetPosition(): b2Vec2;

  /**
   * Set the linear velocity of the center of mass.
   * @param v New linear velocity of the center of mass.
   **/
  SetLinearVelocity(v: b2Vec2): void;

  /**
   *
   * Set the position of the body's origin and rotation.
   * Manipulating a body's transform may cause non-physical behavior.
   * Note: contacts are updated on the next call to b2World::Step.
   * @param position the world position of the body's local origin.
   * @param angle the world rotation in radians.
   */
  SetTransform(position: b2Vec2, angle: number): void;
}

export interface b2World {
  /**
   * Create a rigid body given a definition. No reference to the definition is retained.
   * @param def Body's definition.
   * @return Created rigid body.
   **/
  CreateBody: (def: b2BodyDef) => b2Body;
  /**
   * Destroy a rigid body given a definition. No reference to the definition is retained. This function is locked during callbacks.
   * @param b Body to destroy.
   * @warning This function is locked during callbacks.
   **/
  DestroyBody: (b: b2Body) => void;
  /**
   * Take a time step. This performs collision detection, integration, and constraint solution.
   * @param dt The amout of time to simulate, this should not vary.
   * @param velocityIterations For the velocity constraint solver.
   * @param positionIterations For the position constraint solver.
   **/
  Step: (
    dt: number,
    velocityIterations: number,
    positionIterations: number
  ) => void;
}
