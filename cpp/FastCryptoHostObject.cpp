#include "FastCryptoHostObject.h"
#include <jsi/jsi.h>

#include <box2d/b2_math.h>
#include <box2d/b2_world.h>
#include <box2d/b2_body.h>
#include <box2d/b2_polygon_shape.h>
#include <box2d/b2_fixture.h>
#include <android/log.h>

namespace margelo {

using namespace facebook;

// TODO: Create macros for this so we don't have to repeat ourselves for each JSI func?

std::vector<jsi::PropNameID> FastCryptoHostObject::getPropertyNames(jsi::Runtime& runtime) {
	throw std::runtime_error("Not yet implemented!");
}

jsi::Value FastCryptoHostObject::get(jsi::Runtime& runtime, const jsi::PropNameID& propNameId) {
  auto propName = propNameId.utf8(runtime);

	b2Vec2 gravity(0.0f, -10.0f);
	b2World world(gravity);
	__android_log_print(ANDROID_LOG_DEBUG, "overscore", "createWorld");

	// ground box
	b2BodyDef groundBodyDef;
	groundBodyDef.position.Set(0.0f, -10.0f);
	b2Body* groundBody = world.CreateBody(&groundBodyDef);
	// ground polygon
	b2PolygonShape groundBox;
	groundBox.SetAsBox(50.0f, 10.0f);
	groundBody->CreateFixture(&groundBox, 0.0f);

	// dynamic body
	b2BodyDef bodyDef;
	bodyDef.type = b2_dynamicBody;
	bodyDef.position.Set(0.0f, 4.0f);
	b2Body* body = world.CreateBody(&bodyDef);
	//attach
	b2PolygonShape dynamicBox;
	dynamicBox.SetAsBox(1.0f, 1.0f);

	b2FixtureDef fixtureDef;
	fixtureDef.shape = &dynamicBox;
	fixtureDef.density = 1.0f;
	fixtureDef.friction = 0.3f;

	body->CreateFixture(&fixtureDef);


	// simulating the world
	float timeStep = 1.0f / 60.0f;
	int32 velocityIterations = 6;
	int32 positionIterations = 2;
	for (int32 i = 0; i < 60; ++i)
	{
		world.Step(timeStep, velocityIterations, positionIterations);
		b2Vec2 position = body->GetPosition();
		float angle = body->GetAngle();
		__android_log_print(ANDROID_LOG_DEBUG, "overscore","%4.2f %4.2f %4.2f\n", position.x, position.y, angle);
	}

	throw std::runtime_error("Not yet implemented!");
}

} // namespace margelo
